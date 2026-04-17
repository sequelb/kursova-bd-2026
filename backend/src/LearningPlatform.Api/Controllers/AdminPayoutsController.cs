using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/admin/payouts")]
[Authorize(Roles = Roles.Admin)]
public class AdminPayoutsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<AdminPayoutDto>>> List(
        [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = db.Payouts.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(p => p.Status == status);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.RequestedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new AdminPayoutDto(
                p.Id,
                p.RequestedAt,
                p.TeacherId,
                p.Teacher!.User!.FirstName + " " + p.Teacher.User.LastName,
                p.Amount,
                p.Status))
            .ToListAsync();

        return new PagedResult<AdminPayoutDto>(items, totalCount, page, pageSize);
    }

    [HttpPost("{id:int}/approve")]
    public Task<IActionResult> Approve(int id) => Transition(id, PayoutStatus.Pending, PayoutStatus.Approved);

    [HttpPost("{id:int}/reject")]
    public Task<IActionResult> Reject(int id) => Transition(id, PayoutStatus.Pending, PayoutStatus.Rejected);

    [HttpPost("{id:int}/mark-paid")]
    public Task<IActionResult> MarkPaid(int id) => Transition(id, PayoutStatus.Approved, PayoutStatus.Paid);

    private async Task<IActionResult> Transition(int id, string fromStatus, string toStatus)
    {
        var payout = await db.Payouts.FindAsync(id);
        if (payout is null) return NotFound();
        if (payout.Status != fromStatus)
            return BadRequest(new { error = $"Payout is not in '{fromStatus}' state." });

        payout.Status = toStatus;
        await db.SaveChangesAsync();
        // trg_payouts_balance fires automatically; rejected payouts release the locked funds.
        return NoContent();
    }
}
