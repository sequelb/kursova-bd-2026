using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = Roles.Admin)]
public class AdminFinanceController(AppDbContext db) : ControllerBase
{
    [HttpGet("api/admin/finance-dashboard")]
    public async Task<ActionResult<AdminFinanceDashboardDto>> Dashboard(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        // Defaults: last 30 days, inclusive on both ends.
        // Postgres `timestamp with time zone` requires DateTimeKind.Utc, so
        // strip whatever kind the model binder produced and re-stamp it as UTC.
        var toDate = DateTime.SpecifyKind((to ?? DateTime.UtcNow).Date, DateTimeKind.Utc);
        var fromDate = DateTime.SpecifyKind((from ?? toDate.AddDays(-29)).Date, DateTimeKind.Utc);
        if (fromDate > toDate) return BadRequest(new { error = "'from' must be on or before 'to'." });

        // For "≤ to" inclusive comparisons we want < (to + 1 day)
        var toExclusive = toDate.AddDays(1);
        // Cap the timeline length to avoid pathological responses
        var totalDays = (toExclusive - fromDate).Days;

        var grossRevenue = await db.Payments
            .Where(p => p.Status == PaymentStatus.Completed
                     && p.CreatedAt >= fromDate && p.CreatedAt < toExclusive)
            .SumAsync(p => (decimal?)p.Amount) ?? 0m;

        var totalRefunds = await db.Payments
            .Where(p => p.Status == PaymentStatus.Refunded
                     && p.CreatedAt >= fromDate && p.CreatedAt < toExclusive)
            .SumAsync(p => (decimal?)p.Amount) ?? 0m;

        var paidToTeachers = await db.Payouts
            .Where(p => p.Status == PayoutStatus.Paid
                     && p.RequestedAt >= fromDate && p.RequestedAt < toExclusive)
            .SumAsync(p => (decimal?)p.Amount) ?? 0m;

        // Pending payouts are a current snapshot — not filtered by date.
        var pendingPayouts = await db.Payouts
            .Where(p => p.Status == PayoutStatus.Pending)
            .ToListAsync();

        var revenueRows = await db.Payments
            .Where(p => p.Status == PaymentStatus.Completed
                     && p.CreatedAt >= fromDate && p.CreatedAt < toExclusive)
            .GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Amount = g.Sum(p => p.Amount) })
            .ToListAsync();

        var payoutRows = await db.Payouts
            .Where(p => p.Status == PayoutStatus.Paid
                     && p.RequestedAt >= fromDate && p.RequestedAt < toExclusive)
            .GroupBy(p => p.RequestedAt.Date)
            .Select(g => new { Date = g.Key, Amount = g.Sum(p => p.Amount) })
            .ToListAsync();

        var revByDate = revenueRows.ToDictionary(r => r.Date, r => r.Amount);
        var payByDate = payoutRows.ToDictionary(r => r.Date, r => r.Amount);

        var revenueTimeline = new List<TimelinePointMoneyDto>(totalDays);
        var payoutsTimeline = new List<TimelinePointMoneyDto>(totalDays);
        for (var i = 0; i < totalDays; i++)
        {
            var d = fromDate.AddDays(i);
            revenueTimeline.Add(new TimelinePointMoneyDto(d, revByDate.GetValueOrDefault(d, 0m)));
            payoutsTimeline.Add(new TimelinePointMoneyDto(d, payByDate.GetValueOrDefault(d, 0m)));
        }

        return new AdminFinanceDashboardDto(
            grossRevenue,
            totalRefunds,
            paidToTeachers,
            pendingPayouts.Sum(p => p.Amount),
            pendingPayouts.Count,
            revenueTimeline,
            payoutsTimeline);
    }

    [HttpGet("api/admin/payments")]
    public async Task<ActionResult<PagedResult<AdminPaymentDto>>> ListPayments(
        [FromQuery] string? status, [FromQuery] string? q,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = db.Payments.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(p => p.Status == status);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = $"%{q.Trim()}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Course!.Title, term) ||
                EF.Functions.ILike(p.Student!.FirstName + " " + p.Student.LastName, term));
        }

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new AdminPaymentDto(
                p.Id,
                p.CreatedAt,
                p.StudentId,
                p.Student!.FirstName + " " + p.Student.LastName,
                p.Student.Email,
                p.CourseId,
                p.Course!.Title,
                p.Amount,
                p.Status))
            .ToListAsync();

        return new PagedResult<AdminPaymentDto>(items, totalCount, page, pageSize);
    }

    [HttpPost("api/admin/payments/{id:int}/refund")]
    public async Task<IActionResult> Refund(int id)
    {
        var payment = await db.Payments.FindAsync(id);
        if (payment is null) return NotFound();
        if (payment.Status == PaymentStatus.Refunded)
            return BadRequest(new { error = "Payment is already refunded." });

        await using var tx = await db.Database.BeginTransactionAsync();

        // Flip status — trigger trg_payments_balance recomputes the teacher's balance.
        payment.Status = PaymentStatus.Refunded;

        // Revoke access: delete the matching enrollment. lesson_progress and review
        // cascade-delete with the enrollment.
        var enrollment = await db.Enrollments
            .SingleOrDefaultAsync(e => e.StudentId == payment.StudentId && e.CourseId == payment.CourseId);
        if (enrollment is not null) db.Enrollments.Remove(enrollment);

        await db.SaveChangesAsync();
        await tx.CommitAsync();
        return NoContent();
    }
}
