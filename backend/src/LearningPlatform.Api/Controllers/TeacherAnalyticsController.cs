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
public class TeacherAnalyticsController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("api/teacher/courses/{id:int}/analytics")]
    public async Task<ActionResult<CourseAnalyticsDto>> Analytics(int id)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses
            .SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        var enrollments = await db.Enrollments
            .Where(e => e.CourseId == id)
            .Select(e => new { e.Progress, e.EnrolledAt, e.Student!.FirstName, e.Student.LastName })
            .ToListAsync();

        var revenue = await db.Payments
            .Where(p => p.CourseId == id && p.Status == PaymentStatus.Completed)
            .SumAsync(p => (decimal?)p.Amount) ?? 0m;

        var avgRating = await db.Reviews
            .Where(r => r.Enrollment!.CourseId == id)
            .Select(r => (double?)r.Grade)
            .AverageAsync() ?? 0d;

        var completionRate = enrollments.Count == 0
            ? 0d
            : (double)enrollments.Count(e => e.Progress >= 100) / enrollments.Count * 100d;

        var recent = enrollments
            .OrderByDescending(e => e.EnrolledAt)
            .Take(10)
            .Select(e => new AnalyticsRecentStudentDto(e.FirstName, e.LastName, e.EnrolledAt, e.Progress))
            .ToList();

        return new CourseAnalyticsDto(
            course.Id,
            course.Title,
            enrollments.Count,
            revenue,
            avgRating,
            completionRate,
            recent);
    }

    [HttpGet("api/teacher/courses/{id:int}/enrollments-timeline")]
    public async Task<ActionResult<List<TimelinePointDto>>> Timeline(int id, [FromQuery] int days = 30)
    {
        var teacherId = CurrentUserId;
        var owns = await db.Courses.AnyAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (!owns) return NotFound();

        var since = DateTime.UtcNow.Date.AddDays(-(days - 1));

        var rows = await db.Enrollments
            .Where(e => e.CourseId == id && e.EnrolledAt >= since)
            .GroupBy(e => e.EnrolledAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync();

        // Fill missing days with zero
        var byDate = rows.ToDictionary(r => r.Date, r => r.Count);
        var result = new List<TimelinePointDto>(days);
        for (var i = 0; i < days; i++)
        {
            var d = since.AddDays(i);
            result.Add(new TimelinePointDto(d, byDate.GetValueOrDefault(d, 0)));
        }
        return result;
    }

    [HttpGet("api/teacher/reviews")]
    public async Task<ActionResult<List<TeacherReviewDto>>> Reviews([FromQuery] int? courseId)
    {
        var teacherId = CurrentUserId;
        var query = db.Reviews
            .Where(r => r.Enrollment!.Course!.AuthorId == teacherId);
        if (courseId is not null) query = query.Where(r => r.Enrollment!.CourseId == courseId);

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new TeacherReviewDto(
                r.Id,
                r.Enrollment!.CourseId,
                r.Enrollment.Course!.Title,
                r.Enrollment.Student!.FirstName,
                r.Enrollment.Student.LastName,
                r.Grade,
                r.Comment,
                r.CreatedAt))
            .ToListAsync();
    }
}
