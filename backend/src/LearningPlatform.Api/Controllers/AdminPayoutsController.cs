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
    public async Task<ActionResult<List<AdminPayoutDto>>> List([FromQuery] string? status)
    {
        var query = db.Payouts.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(p => p.Status == status);

        return await query
            .OrderByDescending(p => p.RequestedAt)
            .Select(p => new AdminPayoutDto(
                p.Id,
                p.RequestedAt,
                p.TeacherId,
                p.Teacher!.User!.FirstName + " " + p.Teacher.User.LastName,
                p.Amount,
                p.Status))
            .ToListAsync();
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
