using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class ProgressTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE OR REPLACE FUNCTION recompute_enrollment_progress()
                RETURNS TRIGGER AS $$
                DECLARE
                    target_enrollment_id INT;
                    total_lessons INT;
                    done_lessons INT;
                BEGIN
                    target_enrollment_id := COALESCE(NEW.enrollment_id, OLD.enrollment_id);

                    SELECT COUNT(*) INTO total_lessons
                    FROM lessons l
                    JOIN enrollments e ON e.course_id = l.course_id
                    WHERE e.id = target_enrollment_id;

                    SELECT COUNT(*) INTO done_lessons
                    FROM lesson_progress
                    WHERE enrollment_id = target_enrollment_id;

                    UPDATE enrollments
                    SET progress = CASE
                        WHEN total_lessons = 0 THEN 0
                        ELSE (done_lessons * 100) / total_lessons
                    END
                    WHERE id = target_enrollment_id;

                    RETURN NULL;
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER trg_lesson_progress_recompute
                AFTER INSERT OR DELETE ON lesson_progress
                FOR EACH ROW
                EXECUTE FUNCTION recompute_enrollment_progress();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP TRIGGER IF EXISTS trg_lesson_progress_recompute ON lesson_progress;
                DROP FUNCTION IF EXISTS recompute_enrollment_progress();
                """);
        }
    }
}
