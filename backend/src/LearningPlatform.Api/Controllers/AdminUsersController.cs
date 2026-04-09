using System.Security.Claims;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = Roles.Admin)]
public class AdminUsersController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<AdminUserDto>>> List(
        [FromQuery] string? role,
        [FromQuery] string? status,
        [FromQuery] string? q)
    {
        var query = db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(role)) query = query.Where(u => u.Role == role);
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(u => u.Status == status);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = $"%{q.Trim()}%";
            query = query.Where(u =>
                EF.Functions.ILike(u.Email, term) ||
                EF.Functions.ILike(u.FirstName + " " + u.LastName, term));
        }

        return await query
            .OrderBy(u => u.Id)
            .Select(u => new AdminUserDto(u.Id, u.FirstName, u.LastName, u.Email, u.Role, u.Status))
            .ToListAsync();
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateUserStatusRequest req)
    {
        if (!UserStatus.All.Contains(req.Status))
            return BadRequest(new { error = "Invalid status." });

        if (id == CurrentUserId)
            return BadRequest(new { error = "You cannot change your own status." });

        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        if (user.Role == Roles.Admin)
            return BadRequest(new { error = "Admin accounts cannot be suspended." });

        user.Status = req.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }
}
