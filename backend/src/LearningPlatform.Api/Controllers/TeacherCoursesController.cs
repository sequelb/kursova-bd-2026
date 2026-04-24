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
public class TeacherCoursesController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("api/teacher/courses")]
    public async Task<ActionResult<List<TeacherCourseListItemDto>>> List()
    {
        var teacherId = CurrentUserId;
        var rows = await db.Courses
            .Where(c => c.AuthorId == teacherId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new TeacherCourseListItemDto(
                c.Id,
                c.Title,
                c.Status,
                c.Level,
                c.Price,
                db.Enrollments.Count(e => e.CourseId == c.Id),
                db.Reviews
                    .Where(r => r.Enrollment!.CourseId == c.Id)
                    .Select(r => (double?)r.Grade).Average() ?? 0d,
                c.Lessons.Count,
                c.CreatedAt))
            .ToListAsync();
        return rows;
    }

    [HttpGet("api/teacher/courses/{id:int}")]
    public async Task<ActionResult<TeacherCourseDetailDto>> Get(int id)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses
            .Include(c => c.Categories)
            .Include(c => c.Lessons.OrderBy(l => l.OrderNumber))
            .SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        return new TeacherCourseDetailDto(
            course.Id,
            course.Title,
            course.Description,
            course.Price,
            course.Level,
            course.Status,
            course.CreatedAt,
            course.Categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList(),
            course.Lessons.Select(l => new LessonEditDto(l.Id, l.OrderNumber, l.Title, l.Content)).ToList());
    }

    [HttpPost("api/teacher/courses")]
    public async Task<ActionResult<TeacherCourseDetailDto>> Create(CreateCourseRequest req)
    {
        if (!CourseLevel.All.Contains(req.Level))
            return BadRequest(new { error = "Invalid level." });
        if (req.Price < 0)
            return BadRequest(new { error = "Price cannot be negative." });
        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { error = "Title is required." });

        var teacherId = CurrentUserId;
        var categories = await db.Categories
            .Where(c => req.CategoryIds.Contains(c.Id))
            .ToListAsync();

        var course = new Course
        {
            AuthorId = teacherId,
            Title = req.Title.Trim(),
            Description = req.Description ?? string.Empty,
            Price = req.Price,
            Level = req.Level,
            Status = CourseStatus.Draft,
            Categories = categories,
        };
        db.Courses.Add(course);
        await db.SaveChangesAsync();

        return await Get(course.Id);
    }

    [HttpPut("api/teacher/courses/{id:int}")]
    public async Task<ActionResult<TeacherCourseDetailDto>> Update(int id, UpdateCourseRequest req)
    {
        if (!CourseLevel.All.Contains(req.Level))
            return BadRequest(new { error = "Invalid level." });
        if (req.Price < 0)
            return BadRequest(new { error = "Price cannot be negative." });

        var teacherId = CurrentUserId;
        var course = await db.Courses
            .Include(c => c.Categories)
            .SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        course.Title = req.Title.Trim();
        course.Description = req.Description ?? string.Empty;
        course.Price = req.Price;
        course.Level = req.Level;

        var newCats = await db.Categories.Where(c => req.CategoryIds.Contains(c.Id)).ToListAsync();
        course.Categories.Clear();
        foreach (var c in newCats) course.Categories.Add(c);

        await db.SaveChangesAsync();
        return await Get(id);
    }

    [HttpDelete("api/teacher/courses/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses.SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        var hasEnrollments = await db.Enrollments.AnyAsync(e => e.CourseId == id);
        if (hasEnrollments)
            return BadRequest(new { error = "Cannot delete a course that has enrollments." });

        db.Courses.Remove(course);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("api/teacher/courses/{id:int}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses
            .Include(c => c.Lessons)
            .SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        if (course.Lessons.Count == 0)
            return BadRequest(new { error = "Cannot publish a course with no lessons." });

        course.Status = CourseStatus.Published;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // lessons 

    [HttpPost("api/teacher/courses/{courseId:int}/lessons")]
    public async Task<ActionResult<LessonEditDto>> AddLesson(int courseId, CreateLessonRequest req)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses
            .Include(c => c.Lessons)
            .SingleOrDefaultAsync(c => c.Id == courseId && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { error = "Title is required." });

        var nextOrder = (course.Lessons.Count == 0 ? 0 : course.Lessons.Max(l => l.OrderNumber)) + 1;
        var lesson = new Lesson
        {
            CourseId = courseId,
            OrderNumber = nextOrder,
            Title = req.Title.Trim(),
            Content = req.Content ?? string.Empty,
        };
        db.Lessons.Add(lesson);
        await db.SaveChangesAsync();

        return new LessonEditDto(lesson.Id, lesson.OrderNumber, lesson.Title, lesson.Content);
    }

    [HttpPut("api/teacher/lessons/{id:int}")]
    public async Task<ActionResult<LessonEditDto>> UpdateLesson(int id, UpdateLessonRequest req)
    {
        var teacherId = CurrentUserId;
        var lesson = await db.Lessons
            .Include(l => l.Course)
            .SingleOrDefaultAsync(l => l.Id == id);
        if (lesson is null || lesson.Course!.AuthorId != teacherId) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { error = "Title is required." });

        lesson.Title = req.Title.Trim();
        lesson.Content = req.Content ?? string.Empty;
        await db.SaveChangesAsync();

        return new LessonEditDto(lesson.Id, lesson.OrderNumber, lesson.Title, lesson.Content);
    }

    [HttpDelete("api/teacher/lessons/{id:int}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        var teacherId = CurrentUserId;
        var lesson = await db.Lessons
            .Include(l => l.Course)
            .SingleOrDefaultAsync(l => l.Id == id);
        if (lesson is null || lesson.Course!.AuthorId != teacherId) return NotFound();

        var hasProgress = await db.LessonProgress.AnyAsync(lp => lp.LessonId == id);
        if (hasProgress)
            return BadRequest(new { error = "Cannot delete a lesson that students have already started." });

        if (lesson.Course.Status == CourseStatus.Published)
        {
            var lessonCount = await db.Lessons.CountAsync(l => l.CourseId == lesson.CourseId);
            if (lessonCount <= 1)
                return BadRequest(new { error = "A published course must have at least one lesson. Add another lesson first." });
        }

        var courseId = lesson.CourseId;
        var deletedOrder = lesson.OrderNumber;
        db.Lessons.Remove(lesson);
        await db.SaveChangesAsync();

        var laterLessons = await db.Lessons
            .Where(l => l.CourseId == courseId && l.OrderNumber > deletedOrder)
            .OrderBy(l => l.OrderNumber)
            .ToListAsync();
        foreach (var l in laterLessons) l.OrderNumber -= 1;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("api/teacher/courses/{courseId:int}/lessons/reorder")]
    public async Task<IActionResult> Reorder(int courseId, ReorderLessonsRequest req)
    {
        var teacherId = CurrentUserId;
        var course = await db.Courses
            .Include(c => c.Lessons)
            .SingleOrDefaultAsync(c => c.Id == courseId && c.AuthorId == teacherId);
        if (course is null) return NotFound();

        var existingIds = course.Lessons.Select(l => l.Id).ToHashSet();
        if (req.LessonIds.Length != course.Lessons.Count || req.LessonIds.Any(id => !existingIds.Contains(id)))
            return BadRequest(new { error = "Reorder list must contain exactly the course's lesson ids." });

        await using var tx = await db.Database.BeginTransactionAsync();
        var lessonsById = course.Lessons.ToDictionary(l => l.Id);

        // Hack
        // shift everything after the deleted lesson down by 1.
        // change everything to negative slots
        var temp = -1;
        foreach (var l in course.Lessons) l.OrderNumber = temp--;
        await db.SaveChangesAsync();

        //  assign final order
        for (var i = 0; i < req.LessonIds.Length; i++)
            lessonsById[req.LessonIds[i]].OrderNumber = i + 1;
        await db.SaveChangesAsync();

        await tx.CommitAsync();
        return NoContent();
    }
}
