using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CourseListItemDto>>> List([FromQuery] CourseQuery q)
    {
        var query = db.Courses
            .Where(c => c.Status == CourseStatus.Published)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Q))
        {
            var term = $"%{q.Q.Trim()}%";
            query = query.Where(c => EF.Functions.ILike(c.Title, term));
        }
        if (q.CategoryIds is { Length: > 0 })
            query = query.Where(c => c.Categories.Any(cat => q.CategoryIds.Contains(cat.Id)));
        if (q.MinPrice is not null) query = query.Where(c => c.Price >= q.MinPrice);
        if (q.MaxPrice is not null) query = query.Where(c => c.Price <= q.MaxPrice);
        if (q.CreatedAfter is not null) query = query.Where(c => c.CreatedAt >= q.CreatedAfter);
        if (q.CreatedBefore is not null) query = query.Where(c => c.CreatedAt <= q.CreatedBefore);

        // Project with rating so we can filter/sort on it.
        var projected = query.Select(c => new
        {
            Course = c,
            AverageRating = db.Reviews
                .Where(r => r.Enrollment!.CourseId == c.Id)
                .Select(r => (double?)r.Grade).Average() ?? 0d,
            ReviewCount = db.Reviews.Count(r => r.Enrollment!.CourseId == c.Id),
            EnrollmentCount = db.Enrollments.Count(e => e.CourseId == c.Id),
        });

        if (q.MinRating is not null) projected = projected.Where(p => p.AverageRating >= q.MinRating);
        if (q.MaxRating is not null) projected = projected.Where(p => p.AverageRating <= q.MaxRating);

        projected = q.Sort switch
        {
            "oldest" => projected.OrderBy(p => p.Course.CreatedAt),
            "price_asc" => projected.OrderBy(p => p.Course.Price),
            "price_desc" => projected.OrderByDescending(p => p.Course.Price),
            "rating_desc" => projected.OrderByDescending(p => p.AverageRating),
            _ => projected.OrderByDescending(p => p.Course.CreatedAt), // newest (default)
        };

        var rows = await projected
            .Select(p => new CourseListItemDto(
                p.Course.Id,
                p.Course.Title,
                p.Course.Price,
                p.Course.Level,
                p.Course.CreatedAt,
                new AuthorDto(p.Course.Author!.UserId, p.Course.Author.User!.FirstName, p.Course.Author.User.LastName),
                p.Course.Categories.Select(cat => new CategoryDto(cat.Id, cat.Name)).ToList(),
                p.AverageRating,
                p.ReviewCount,
                p.EnrollmentCount))
            .ToListAsync();

        return rows;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CourseDetailDto>> Get(int id)
    {
        var course = await db.Courses
            .Include(c => c.Author!).ThenInclude(a => a.User)
            .Include(c => c.Categories)
            .Include(c => c.Lessons.OrderBy(l => l.OrderNumber))
            .SingleOrDefaultAsync(c => c.Id == id);

        if (course is null) return NotFound();

        var reviews = await db.Reviews
            .Where(r => r.Enrollment!.CourseId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id,
                r.Grade,
                r.Comment,
                r.CreatedAt,
                r.Enrollment!.Student!.FirstName,
                r.Enrollment.Student.LastName))
            .ToListAsync();

        var avg = reviews.Count == 0 ? 0d : reviews.Average(r => (double)r.Grade);
        var enrollmentCount = await db.Enrollments.CountAsync(e => e.CourseId == id);

        return new CourseDetailDto(
            course.Id,
            course.Title,
            course.Description,
            course.Price,
            course.Level,
            course.Status,
            course.CreatedAt,
            new AuthorDto(course.Author!.UserId, course.Author.User!.FirstName, course.Author.User.LastName),
            course.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList(),
            course.Lessons.Select(l => new LessonSummaryDto(l.Id, l.OrderNumber, l.Title)).ToList(),
            reviews,
            avg,
            enrollmentCount);
    }
}
