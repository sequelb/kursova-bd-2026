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
            // Index 1: courses.author_id
            // Justification: TeacherCoursesController.List queries all courses
            // for a given teacher (`WHERE author_id = @teacherId`). Also used by
            // AuthorsController to list an author's published courses, and by the
            // recommendation procedure's peer_enrollments CTE (joining courses to
            // find teacher ownership). Without this index, every "My Courses" page
            // load for a teacher does a sequential scan on courses.
            migrationBuilder.Sql(
                "CREATE INDEX idx_courses_author_id ON courses (author_id);");

            // Index 2: enrollments.student_id
            // Justification: EnrollmentsController.List queries enrollments for the
            // current student (`WHERE student_id = @studentId`). This is the "My Learning"
            // page — hit on every student login. Also used by the recommendation
            // procedure (finding the student's enrolled courses). The unique composite
            // index on (student_id, course_id) partially covers this, but a dedicated
            // single-column index is more efficient for student-only lookups.
            migrationBuilder.Sql(
                "CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);");

            // Index 3: enrollments.course_id
            // Justification: CoursesController.Get counts enrollments per course
            // (`COUNT(*) WHERE course_id = @id`) for the course detail page.
            // TeacherAnalyticsController.Analytics and Timeline also query enrollments
            // by course_id. The recommendation procedure joins enrollments on course_id
            // in its peer-discovery CTEs. High-traffic column.
            migrationBuilder.Sql(
                "CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);");

            // Index 4: payments.course_id
            // Justification: AdminFinanceController.ListPayments searches and filters
            // payments, joining to courses for the course title. TeacherAnalyticsController
            // sums payment amounts per course for the revenue KPI. Also used by the
            // recompute_teacher_balance trigger function which sums completed payments
            // for a teacher's courses.
            migrationBuilder.Sql(
                "CREATE INDEX idx_payments_course_id ON payments (course_id);");

            // Index 5: payouts.teacher_id
            // Justification: TeacherEarningsController.Get lists payouts for the current
            // teacher (`WHERE teacher_id = @teacherId`). AdminPayoutsController also
            // searches payouts by teacher. The recompute_teacher_balance trigger function
            // sums non-rejected payouts per teacher. Without this index, every earnings
            // page load and every balance recomputation scans the full payouts table.
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
