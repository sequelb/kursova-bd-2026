using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class RecommendationsWeighted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                -- Weighted association-rule-based course recommendation procedure.
                --
                -- Three scoring signals combined:
                --   1. Co-enrollment count (association rules, the primary signal)
                --      Weighted by peer completion: peers who finished the shared course
                --      are stronger signals than peers who enrolled but didn't start.
                --      Weight = 0.5 + 0.5 × (peer_progress / 100). This means a
                --      non-starter still contributes 50% — enrollment itself is meaningful.
                --
                --   2. Rating quality: the recommended course's average rating.
                --      Multiplier = COALESCE(avg_rating, 3.0) / 5.0
                --      Well-rated courses (5★) get 1.0×, poorly-rated (1★) get 0.2×,
                --      unrated courses get a neutral 0.6×.
                --
                --   3. Category affinity: if the recommended course shares categories
                --      with courses the student already took, it gets a small bonus.
                --      Multiplier = 1.0 + 0.2 × number_of_overlapping_categories
                --
                -- Final score = SUM(completion_weighted_peers) × rating_mult × category_mult
                --
                -- Cold-start fallback unchanged: popular courses if 0 enrollments.

                CREATE OR REPLACE FUNCTION get_recommendations(
                    target_student_id INT,
                    max_results INT DEFAULT 6
                )
                RETURNS TABLE (course_id INT, score NUMERIC, reason TEXT)
                AS $$
                DECLARE
                    student_course_count INT;
                BEGIN
                    SELECT COUNT(*) INTO student_course_count
                    FROM enrollments WHERE student_id = target_student_id;

                    IF student_course_count = 0 THEN
                        RETURN QUERY
                        SELECT
                            c.id AS course_id,
                            COUNT(e.id)::NUMERIC AS score,
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
                    -- Categories the student is interested in (from their enrollments)
                    my_categories AS (
                        SELECT DISTINCT cc.categories_id AS cat_id
                        FROM my_courses mc
                        JOIN course_categories cc ON cc.courses_id = mc.course_id
                    ),
                    -- For each of my courses, find peer students and their other enrollments.
                    -- Include the peer's progress on the SHARED course as a quality signal.
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
                    -- Sum completion-weighted peer counts per (shared, recommended) rule
                    rule_counts AS (
                        SELECT
                            pe.rec_course_id,
                            pe.shared_course_id,
                            SUM(0.5 + 0.5 * pe.peer_shared_progress / 100.0) AS weighted_count,
                            COUNT(DISTINCT pe.peer_id) AS raw_count
                        FROM peer_enrollments pe
                        GROUP BY pe.rec_course_id, pe.shared_course_id
                    ),
                    -- Best rule per recommended course (for the reason string)
                    best_rule AS (
                        SELECT DISTINCT ON (rc.rec_course_id)
                            rc.rec_course_id,
                            rc.shared_course_id,
                            rc.raw_count
                        FROM rule_counts rc
                        ORDER BY rc.rec_course_id, rc.weighted_count DESC
                    ),
                    -- Rating quality per recommended course
                    ratings AS (
                        SELECT
                            r.enrollment_id,
                            e.course_id AS rec_course_id,
                            r.grade
                        FROM reviews r
                        JOIN enrollments e ON e.id = r.enrollment_id
                    ),
                    avg_ratings AS (
                        SELECT
                            rec_course_id,
                            COALESCE(AVG(grade), 3.0) AS avg_rating
                        FROM ratings
                        GROUP BY rec_course_id
                    ),
                    -- Category overlap between recommended course and student's interests
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
                            rc.rec_course_id,
                            SUM(rc.weighted_count)
                                * (COALESCE(ar.avg_rating, 3.0) / 5.0)
                                * (1.0 + 0.2 * COALESCE(co.overlap_count, 0))
                            AS final_score,
                            br.shared_course_id AS best_shared_id,
                            br.raw_count AS best_raw_count
                        FROM rule_counts rc
                        JOIN best_rule br ON br.rec_course_id = rc.rec_course_id
                        LEFT JOIN avg_ratings ar ON ar.rec_course_id = rc.rec_course_id
                        LEFT JOIN cat_overlap co ON co.rec_course_id = rc.rec_course_id
                        GROUP BY rc.rec_course_id, br.shared_course_id, br.raw_count,
                                 ar.avg_rating, co.overlap_count
                    )
                    SELECT
                        s.rec_course_id AS course_id,
                        ROUND(s.final_score, 2) AS score,
                        FORMAT('%s students who took "%s" also took this',
                            s.best_raw_count,
                            (SELECT c2.title FROM courses c2 WHERE c2.id = s.best_shared_id)
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
            // Revert to the unweighted version would require re-running
            // the original migration. For simplicity, just drop the function.
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_recommendations(INT, INT);");
        }
    }
}
