using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class TeacherBalanceTriggers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                -- Helper procedure: recompute a single teacher's balance from scratch.
                -- balance = sum(completed payments to teacher's courses)
                --         - sum(non-rejected payouts to teacher)
                CREATE OR REPLACE FUNCTION recompute_teacher_balance(target_teacher_id INT)
                RETURNS VOID AS $$
                BEGIN
                    UPDATE teacher_profiles tp
                    SET balance = COALESCE((
                        SELECT SUM(p.amount)
                        FROM payments p
                        JOIN courses c ON c.id = p.course_id
                        WHERE c.author_id = tp.user_id
                          AND p.status = 'Completed'
                    ), 0) - COALESCE((
                        SELECT SUM(po.amount)
                        FROM payouts po
                        WHERE po.teacher_id = tp.user_id
                          AND po.status IN ('Pending', 'Approved', 'Paid')
                    ), 0)
                    WHERE tp.user_id = target_teacher_id;
                END;
                $$ LANGUAGE plpgsql;

                -- Trigger function: when a payment row changes, recompute the affected teacher's balance.
                CREATE OR REPLACE FUNCTION trg_payments_recompute_balance()
                RETURNS TRIGGER AS $$
                DECLARE
                    affected_teacher INT;
                BEGIN
                    SELECT author_id INTO affected_teacher
                    FROM courses
                    WHERE id = COALESCE(NEW.course_id, OLD.course_id);

                    IF affected_teacher IS NOT NULL THEN
                        PERFORM recompute_teacher_balance(affected_teacher);
                    END IF;

                    RETURN NULL;
                END;
                $$ LANGUAGE plpgsql;

                -- Trigger function: when a payout row changes, recompute the affected teacher's balance.
                CREATE OR REPLACE FUNCTION trg_payouts_recompute_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    PERFORM recompute_teacher_balance(COALESCE(NEW.teacher_id, OLD.teacher_id));
                    RETURN NULL;
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER trg_payments_balance
                AFTER INSERT OR UPDATE OF status ON payments
                FOR EACH ROW
                EXECUTE FUNCTION trg_payments_recompute_balance();

                CREATE TRIGGER trg_payouts_balance
                AFTER INSERT OR UPDATE OF status ON payouts
                FOR EACH ROW
                EXECUTE FUNCTION trg_payouts_recompute_balance();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP TRIGGER IF EXISTS trg_payments_balance ON payments;
                DROP TRIGGER IF EXISTS trg_payouts_balance ON payouts;
                DROP FUNCTION IF EXISTS trg_payments_recompute_balance();
                DROP FUNCTION IF EXISTS trg_payouts_recompute_balance();
                DROP FUNCTION IF EXISTS recompute_teacher_balance(INT);
                """);
        }
    }
}
