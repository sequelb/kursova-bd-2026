using System.Security.Claims;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/me")]
[Authorize]
public class MeController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserResponse>> Get()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var id)) return Unauthorized();

        var user = await db.Users.FindAsync(id);
        if (user is null) return Unauthorized();

        return new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, user.Role);
    }
}
