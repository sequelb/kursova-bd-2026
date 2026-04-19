using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class RecommendationsWithMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                -- Drop the old function first because we're changing the return type
                -- (adding confidence and lift columns). CREATE OR REPLACE can't do that.
                DROP FUNCTION IF EXISTS get_recommendations(INT, INT);

                -- Association-rule recommendations with full metrics.
                --
                -- Returns: course_id, score, confidence, lift, reason
                --
                -- Confidence = P(recommended | shared) — "of students who took
                --   the shared course, what fraction also took the recommended one?"
                --
                -- Lift = confidence / P(recommended) — "is this stronger than
                --   random chance?" Lift > 1 means a real pattern.
                --
                -- Score combines:
                --   SUM(confidence × lift × completion_weight)
                --     × (avg_rating / 5.0)
                --     × (1 + 0.2 × category_overlap)
                --
                -- The reason text includes confidence% and lift×.

                CREATE OR REPLACE FUNCTION get_recommendations(
                    target_student_id INT,
                    max_results INT DEFAULT 6
                )
                RETURNS TABLE (course_id INT, score NUMERIC, confidence NUMERIC, lift NUMERIC, reason TEXT)
                AS $$
                DECLARE
                    student_course_count INT;
                    total_students INT;
                BEGIN
                    SELECT COUNT(*) INTO student_course_count
                    FROM enrollments WHERE student_id = target_student_id;

                    SELECT COUNT(DISTINCT student_id) INTO total_students
                    FROM enrollments;

                    -- Cold start: no enrollments → popular courses
                    IF student_course_count = 0 THEN
                        RETURN QUERY
                        SELECT
                            c.id AS course_id,
                            COUNT(e.id)::NUMERIC AS score,
                            0::NUMERIC AS confidence,
                            0::NUMERIC AS lift,
                            'Popular on the platform'::TEXT AS reason
                        FROM courses c
                        LEFT JOIN enrollments e ON e.course_id = c.id
                        WHERE c.status = 'Published'
                        GROUP BY c.id
                        ORDER BY score DESC
                        LIMIT max_results;
                        RETURN;
                    END IF;

                    RETURN QUERY
                    WITH my_courses AS (
                        SELECT e.course_id
                        FROM enrollments e
                        WHERE e.student_id = target_student_id
                    ),
                    my_categories AS (
                        SELECT DISTINCT cc.categories_id AS cat_id
                        FROM my_courses mc
                        JOIN course_categories cc ON cc.courses_id = mc.course_id
                    ),
                    -- Enrollment counts per course (for confidence and lift denominators)
                    course_enrollment_counts AS (
                        SELECT enr.course_id, COUNT(DISTINCT enr.student_id) AS cnt
                        FROM enrollments enr
                        GROUP BY enr.course_id
                    ),
                    -- Peer enrollments with completion weight
                    peer_enrollments AS (
                        SELECT
                            e_mine.course_id   AS shared_course_id,
                            e_other.course_id  AS rec_course_id,
                            e_other.student_id AS peer_id,
                            e_peer.progress    AS peer_shared_progress
                        FROM enrollments e_mine
                        JOIN enrollments e_peer
                            ON e_peer.course_id = e_mine.course_id
                           AND e_peer.student_id != target_student_id
                        JOIN enrollments e_other
                            ON e_other.student_id = e_peer.student_id
                        WHERE e_mine.student_id = target_student_id
                          AND e_other.course_id NOT IN (SELECT mc.course_id FROM my_courses mc)
                    ),
                    -- Per-rule metrics
                    rule_metrics AS (
                        SELECT
                            pe.rec_course_id,
                            pe.shared_course_id,
                            COUNT(DISTINCT pe.peer_id) AS co_count,
                            -- Confidence: co_count / enrolled_in_shared
                            COUNT(DISTINCT pe.peer_id)::NUMERIC
                                / NULLIF(cec_shared.cnt, 0) AS rule_confidence,
                            -- Lift: confidence / (enrolled_in_rec / total_students)
                            (COUNT(DISTINCT pe.peer_id)::NUMERIC
                                / NULLIF(cec_shared.cnt, 0))
                                / NULLIF(cec_rec.cnt::NUMERIC / NULLIF(total_students, 0), 0)
                            AS rule_lift,
                            -- Completion-weighted peer count
                            SUM(0.5 + 0.5 * pe.peer_shared_progress / 100.0) AS weighted_peers
                        FROM peer_enrollments pe
                        JOIN course_enrollment_counts cec_shared
                            ON cec_shared.course_id = pe.shared_course_id
                        JOIN course_enrollment_counts cec_rec
                            ON cec_rec.course_id = pe.rec_course_id
                        GROUP BY pe.rec_course_id, pe.shared_course_id,
                                 cec_shared.cnt, cec_rec.cnt
                    ),
                    -- Best rule per recommended course (highest confidence × lift)
                    best_rule AS (
                        SELECT DISTINCT ON (rm.rec_course_id)
                            rm.rec_course_id,
                            rm.shared_course_id,
                            rm.co_count,
                            rm.rule_confidence,
                            rm.rule_lift
                        FROM rule_metrics rm
                        ORDER BY rm.rec_course_id, (rm.rule_confidence * rm.rule_lift) DESC
                    ),
                    -- Rating quality
                    avg_ratings AS (
                        SELECT
                            e.course_id AS rec_course_id,
                            COALESCE(AVG(r.grade), 3.0) AS avg_rating
                        FROM reviews r
                        JOIN enrollments e ON e.id = r.enrollment_id
                        GROUP BY e.course_id
                    ),
                    -- Category overlap
                    cat_overlap AS (
                        SELECT
                            cc.courses_id AS rec_course_id,
                            COUNT(mc.cat_id) AS overlap_count
                        FROM course_categories cc
                        JOIN my_categories mc ON mc.cat_id = cc.categories_id
                        GROUP BY cc.courses_id
                    ),
                    -- Final scoring
                    scored AS (
                        SELECT
                            rm.rec_course_id,
                            SUM(rm.rule_confidence * COALESCE(rm.rule_lift, 1)
                                * rm.weighted_peers)
                                * (COALESCE(ar.avg_rating, 3.0) / 5.0)
                                * (1.0 + 0.2 * COALESCE(co.overlap_count, 0))
                            AS final_score,
                            br.shared_course_id,
                            br.co_count,
                            br.rule_confidence AS best_confidence,
                            br.rule_lift AS best_lift
                        FROM rule_metrics rm
                        JOIN best_rule br ON br.rec_course_id = rm.rec_course_id
                        LEFT JOIN avg_ratings ar ON ar.rec_course_id = rm.rec_course_id
                        LEFT JOIN cat_overlap co ON co.rec_course_id = rm.rec_course_id
                        GROUP BY rm.rec_course_id, br.shared_course_id, br.co_count,
                                 br.rule_confidence, br.rule_lift,
                                 ar.avg_rating, co.overlap_count
                    )
                    SELECT
                        s.rec_course_id AS course_id,
                        ROUND(s.final_score, 2) AS score,
                        ROUND(s.best_confidence * 100, 1) AS confidence,
                        ROUND(COALESCE(s.best_lift, 0), 2) AS lift,
                        FORMAT('%s%% of students who took "%s" also took this (%s× above average)',
                            ROUND(s.best_confidence * 100),
                            (SELECT c2.title FROM courses c2 WHERE c2.id = s.shared_course_id),
                            ROUND(COALESCE(s.best_lift, 1), 1)
                        )::TEXT AS reason
                    FROM scored s
                    JOIN courses c ON c.id = s.rec_course_id AND c.status = 'Published'
                    ORDER BY s.final_score DESC
                    LIMIT max_results;
                END;
                $$ LANGUAGE plpgsql;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_recommendations(INT, INT);");
        }
    }
}
