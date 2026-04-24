using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExplicitIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            // courses.author_id
            // view all author's courses
            migrationBuilder.Sql(
                "CREATE INDEX idx_courses_author_id ON courses (author_id);");

            // enrollments.student_id
            // view all student's courses
            migrationBuilder.Sql(
                "CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);");

            // enrollments.course_id
            // teacher analytics
            migrationBuilder.Sql(
                "CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);");

            // payments.course_id
            // teacher analytics
            migrationBuilder.Sql(
                "CREATE INDEX idx_payments_course_id ON payments (course_id);");

            //payouts.teacher_id
            // teacher payouts
            migrationBuilder.Sql(
                "CREATE INDEX idx_payouts_teacher_id ON payouts (teacher_id);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_courses_author_id;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_enrollments_student_id;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_enrollments_course_id;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_payments_course_id;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_payouts_teacher_id;");
        }
    }
}
