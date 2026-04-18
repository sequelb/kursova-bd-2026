using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class Recommendations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                -- Association-rule-based course recommendation procedure.
                --
                -- For a given student, finds courses that are frequently co-enrolled
                -- with the student's existing courses by other students. This is the
                -- "students who took X also took Y" pattern (market basket analysis).
                --
                -- Algorithm:
                --   1. Find the student's enrolled courses ("my courses").
                --   2. For each of my courses, find other students enrolled in the same course.
                --   3. For each of those "peer" students, find what OTHER courses they are
                --      enrolled in that I am NOT enrolled in.
                --   4. Count co-occurrences per (shared_course, recommended_course) pair.
                --      This is the "support" of the association rule {shared} → {recommended}.
                --   5. For each recommended course, sum the co-counts across all rules
                --      (total score) and pick the strongest individual rule for the
                --      human-readable "reason" string.
                --   6. Return the top N by score.
                --
                -- Cold-start fallback: if the student has zero enrollments, return the
                -- most popular published courses on the platform.
                --
                -- Callable from psql:  SELECT * FROM get_recommendations(42);
                -- Callable from psql:  SELECT * FROM get_recommendations(42, 10);

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

                    -- Cold start: no enrollments → recommend popular courses
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

                    -- Main: association rules
                    RETURN QUERY
                    WITH my_courses AS (
                        SELECT e.course_id
                        FROM enrollments e
                        WHERE e.student_id = target_student_id
                    ),
                    -- For each of my courses, find peer students and their other enrollments
                    peer_enrollments AS (
                        SELECT
                            e_mine.course_id   AS shared_course_id,
                            e_other.course_id  AS rec_course_id,
                            e_other.student_id AS peer_id
                        FROM enrollments e_mine
                        JOIN enrollments e_peer
                            ON e_peer.course_id = e_mine.course_id
                           AND e_peer.student_id != target_student_id
                        JOIN enrollments e_other
                            ON e_other.student_id = e_peer.student_id
                        WHERE e_mine.student_id = target_student_id
                          AND e_other.course_id NOT IN (SELECT mc.course_id FROM my_courses mc)
                    ),
                    -- Count distinct peers per (shared, recommended) rule
                    rule_counts AS (
                        SELECT
                            pe.rec_course_id,
                            pe.shared_course_id,
                            COUNT(DISTINCT pe.peer_id) AS co_count
                        FROM peer_enrollments pe
                        GROUP BY pe.rec_course_id, pe.shared_course_id
                    ),
                    -- For each recommended course, find the strongest rule
                    best_rule_per_rec AS (
                        SELECT DISTINCT ON (rc.rec_course_id)
                            rc.rec_course_id,
                            rc.shared_course_id,
                            rc.co_count
                        FROM rule_counts rc
                        ORDER BY rc.rec_course_id, rc.co_count DESC
                    ),
                    -- Aggregate total score and attach the best rule's info
                    scored AS (
                        SELECT
                            rc.rec_course_id,
                            SUM(rc.co_count)::NUMERIC AS total_score,
                            br.shared_course_id AS best_shared_id,
                            br.co_count          AS best_co_count
                        FROM rule_counts rc
                        JOIN best_rule_per_rec br ON br.rec_course_id = rc.rec_course_id
                        GROUP BY rc.rec_course_id, br.shared_course_id, br.co_count
                    )
                    SELECT
                        s.rec_course_id AS course_id,
                        ROUND(s.total_score, 2) AS score,
                        FORMAT('%s students who took "%s" also took this',
                            s.best_co_count,
                            (SELECT c2.title FROM courses c2 WHERE c2.id = s.best_shared_id)
                        )::TEXT AS reason
                    FROM scored s
                    JOIN courses c ON c.id = s.rec_course_id AND c.status = 'Published'
                    ORDER BY s.total_score DESC
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
