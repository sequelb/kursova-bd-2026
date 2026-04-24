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

                    -- cold start: no enrollments : recommend popular courses
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
                    rule_counts AS (
                        SELECT
                            pe.rec_course_id,
                            pe.shared_course_id,
                            COUNT(DISTINCT pe.peer_id) AS co_count
                        FROM peer_enrollments pe
                        GROUP BY pe.rec_course_id, pe.shared_course_id
                    ),
                    best_rule_per_rec AS (
                        SELECT DISTINCT ON (rc.rec_course_id)
                            rc.rec_course_id,
                            rc.shared_course_id,
                            rc.co_count
                        FROM rule_counts rc
                        ORDER BY rc.rec_course_id, rc.co_count DESC
                    ),
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
