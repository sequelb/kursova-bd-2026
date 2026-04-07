using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/authors")]
[Authorize] // any logged-in user can view an author profile
public class AuthorsController(AppDbContext db) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AuthorPublicDto>> Get(int id)
    {
        var profile = await db.TeacherProfiles
            .Include(p => p.User)
            .SingleOrDefaultAsync(p => p.UserId == id);
        if (profile is null || profile.User is null) return NotFound();

        var courses = await db.Courses
            .Where(c => c.AuthorId == id && c.Status == CourseStatus.Published)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new AuthorPublicCourseDto(
                c.Id,
                c.Title,
                c.Price,
                c.Level,
                c.CreatedAt,
                db.Reviews.Where(r => r.Enrollment!.CourseId == c.Id).Select(r => (double?)r.Grade).Average() ?? 0d,
                db.Reviews.Count(r => r.Enrollment!.CourseId == c.Id)))
            .ToListAsync();

        return new AuthorPublicDto(
            profile.UserId,
            profile.User.FirstName,
            profile.User.LastName,
            profile.Bio,
            courses);
    }
}
