using System.Security.Claims;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = Roles.Teacher)]
public class TeacherEarningsController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("api/teacher/earnings")]
    public async Task<ActionResult<EarningsDto>> Get()
    {
        var teacherId = CurrentUserId;
        var profile = await db.TeacherProfiles.FindAsync(teacherId);
        if (profile is null) return NotFound();

        var history = await db.Payouts
            .Where(p => p.TeacherId == teacherId)
            .OrderByDescending(p => p.RequestedAt)
            .Select(p => new PayoutHistoryItemDto(p.Id, p.Amount, p.Status, p.RequestedAt))
            .ToListAsync();

        return new EarningsDto(profile.Balance, history);
    }

    [HttpPost("api/teacher/payouts")]
    public async Task<ActionResult<PayoutHistoryItemDto>> RequestPayout(CreatePayoutRequest req)
    {
        if (req.Amount <= 0)
            return BadRequest(new { error = "Amount must be greater than zero." });

        var teacherId = CurrentUserId;
        var profile = await db.TeacherProfiles.FindAsync(teacherId);
        if (profile is null) return NotFound();

        if (profile.Balance < req.Amount)
            return BadRequest(new { error = "Insufficient balance." });

        var payout = new Payout
        {
            TeacherId = teacherId,
            Amount = req.Amount,
            Status = PayoutStatus.Pending,
        };
        db.Payouts.Add(payout);
        await db.SaveChangesAsync();
        // Trigger trg_payouts_balance recomputes profile.balance automatically.

        return new PayoutHistoryItemDto(payout.Id, payout.Amount, payout.Status, payout.RequestedAt);
    }
}
