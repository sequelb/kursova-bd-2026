using System.Security.Claims;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/me/teacher-profile")]
[Authorize(Roles = Roles.Teacher)]
public class MyTeacherProfileController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<MyTeacherProfileDto>> Get()
    {
        var profile = await db.TeacherProfiles.FindAsync(CurrentUserId);
        if (profile is null) return NotFound();
        return new MyTeacherProfileDto(profile.Bio, profile.Balance);
    }

    [HttpPut]
    public async Task<ActionResult<MyTeacherProfileDto>> Update(UpdateMyTeacherProfileRequest req)
    {
        var profile = await db.TeacherProfiles.FindAsync(CurrentUserId);
        if (profile is null) return NotFound();

        profile.Bio = req.Bio ?? string.Empty;
        await db.SaveChangesAsync();
        return new MyTeacherProfileDto(profile.Bio, profile.Balance);
    }
}
