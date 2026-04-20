using System.Security.Claims;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = Roles.Student)]
public class EnrollmentsController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("api/me/recommendations")]
    public async Task<ActionResult<List<RecommendedCourseDto>>> Recommendations()
    {
        var studentId = CurrentUserId;

        // Call the SQL function
        var rawResults = await db.Database
            .SqlQuery<RawRecommendation>($"SELECT * FROM get_recommendations({studentId}, 6)")
            .ToListAsync();

        if (rawResults.Count == 0) return new List<RecommendedCourseDto>();

        var courseIds = rawResults.Select(r => r.course_id).ToList();
        var reasonMap = rawResults.ToDictionary(r => r.course_id, r => (r.score, r.reason));

        // Hydrate full course details for each recommended course
        var courses = await db.Courses
            .Where(c => courseIds.Contains(c.Id))
            .Include(c => c.Author!).ThenInclude(a => a.User)
            .Include(c => c.Categories)
            .ToListAsync();

        var result = new List<RecommendedCourseDto>();
        foreach (var rec in rawResults)
        {
            var c = courses.FirstOrDefault(c => c.Id == rec.course_id);
            if (c is null) continue;

            var avgRating = await db.Reviews
                .Where(r => r.Enrollment!.CourseId == c.Id)
                .Select(r => (double?)r.Grade)
                .AverageAsync() ?? 0d;
            var reviewCount = await db.Reviews.CountAsync(r => r.Enrollment!.CourseId == c.Id);
            var enrollmentCount = await db.Enrollments.CountAsync(e => e.CourseId == c.Id);

            result.Add(new RecommendedCourseDto(
                c.Id, c.Title, c.Price, c.Level, c.CreatedAt,
                new AuthorDto(c.Author!.UserId, c.Author.User!.FirstName, c.Author.User.LastName),
                c.Categories.Select(cat => new CategoryDto(cat.Id, cat.Name)).ToList(),
                avgRating, reviewCount, enrollmentCount,
                (double)rec.score, (double)rec.confidence, (double)rec.lift, rec.reason));
        }

        return result;
    }

    // raw result structure from the sql function
    private class RawRecommendation
    {
        public int course_id { get; set; }
        public decimal score { get; set; }
        public decimal confidence { get; set; }
        public decimal lift { get; set; }
        public string reason { get; set; } = "";
    }

    [HttpGet("api/me/enrollments")]
    public async Task<ActionResult<List<EnrollmentListItemDto>>> List()
    {
        var studentId = CurrentUserId;
        var rows = await db.Enrollments
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.EnrolledAt)
            .Select(e => new
            {
                e.Id,
                e.CourseId,
                CourseTitle = e.Course!.Title,
                e.Progress,
                e.EnrolledAt,
                NextLessonId = e.Course.Lessons
                    .Where(l => !db.LessonProgress.Any(lp => lp.EnrollmentId == e.Id && lp.LessonId == l.Id))
                    .OrderBy(l => l.OrderNumber)
                    .Select(l => (int?)l.Id)
                    .FirstOrDefault(),
            })
            .ToListAsync();

        return rows.Select(r => new EnrollmentListItemDto(
            r.Id, r.CourseId, r.CourseTitle, r.Progress, r.NextLessonId, r.EnrolledAt)).ToList();
    }

    [HttpGet("api/me/enrollments/{id:int}")]
    public async Task<ActionResult<EnrollmentDetailDto>> Get(int id)
    {
        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .Include(e => e.Course!).ThenInclude(c => c.Lessons.OrderBy(l => l.OrderNumber))
            .SingleOrDefaultAsync(e => e.Id == id && e.StudentId == studentId);

        if (enrollment is null) return NotFound();

        var completed = await db.LessonProgress
            .Where(lp => lp.EnrollmentId == id)
            .Select(lp => lp.LessonId)
            .ToListAsync();

        var myReview = await db.Reviews
            .Where(r => r.EnrollmentId == id)
            .Select(r => new MyReviewDto(r.Id, r.Grade, r.Comment, r.CreatedAt))
            .SingleOrDefaultAsync();

        return new EnrollmentDetailDto(
            enrollment.Id,
            enrollment.CourseId,
            enrollment.Course!.Title,
            enrollment.Progress,
            enrollment.EnrolledAt,
            enrollment.Course.Lessons.Select(l => new LessonSummaryDto(l.Id, l.OrderNumber, l.Title)).ToList(),
            completed,
            myReview);
    }

    [HttpGet("api/me/enrollments/{id:int}/lessons/{lessonId:int}")]
    public async Task<ActionResult<LessonContentDto>> GetLesson(int id, int lessonId)
    {
        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .SingleOrDefaultAsync(e => e.Id == id && e.StudentId == studentId);
        if (enrollment is null) return NotFound();

        var lesson = await db.Lessons
            .SingleOrDefaultAsync(l => l.Id == lessonId && l.CourseId == enrollment.CourseId);
        if (lesson is null) return NotFound();

        return new LessonContentDto(lesson.Id, lesson.OrderNumber, lesson.Title, lesson.Content);
    }

    [HttpPost("api/courses/{courseId:int}/enroll")]
    public async Task<ActionResult<EnrollResultDto>> Enroll(int courseId)
    {
        var studentId = CurrentUserId;

        var course = await db.Courses
            .Include(c => c.Lessons.OrderBy(l => l.OrderNumber))
            .SingleOrDefaultAsync(c => c.Id == courseId && c.Status == CourseStatus.Published);
        if (course is null) return NotFound(new { error = "Course not found." });

        if (await db.Enrollments.AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId))
            return BadRequest(new { error = "Already enrolled." });

        await using var tx = await db.Database.BeginTransactionAsync();

        db.Payments.Add(new Payment
        {
            StudentId = studentId,
            CourseId = courseId,
            Amount = course.Price,
            Status = PaymentStatus.Completed,
        });

        var enrollment = new Enrollment
        {
            StudentId = studentId,
            CourseId = courseId,
        };
        db.Enrollments.Add(enrollment);

        // The teacher's balance is recomputed by trigger trg_payments_balance
        // when the payments row is inserted above.

        await db.SaveChangesAsync();
        await tx.CommitAsync();

        var firstLessonId = course.Lessons.FirstOrDefault()?.Id;
        return new EnrollResultDto(enrollment.Id, firstLessonId);
    }

    [HttpDelete("api/enrollments/{id:int}/lessons/{lessonId:int}/complete")]
    public async Task<IActionResult> UncompleteLesson(int id, int lessonId)
    {
        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .SingleOrDefaultAsync(e => e.Id == id && e.StudentId == studentId);
        if (enrollment is null) return NotFound();

        var row = await db.LessonProgress
            .SingleOrDefaultAsync(lp => lp.EnrollmentId == id && lp.LessonId == lessonId);
        if (row is null) return NoContent();

        db.LessonProgress.Remove(row);
        await db.SaveChangesAsync();
        
        // trigger updates enrollments.progress
        return NoContent();
    }

    [HttpPost("api/enrollments/{id:int}/lessons/{lessonId:int}/complete")]
    public async Task<IActionResult> CompleteLesson(int id, int lessonId)
    {
        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .SingleOrDefaultAsync(e => e.Id == id && e.StudentId == studentId);
        if (enrollment is null) return NotFound();

        var lesson = await db.Lessons
            .SingleOrDefaultAsync(l => l.Id == lessonId && l.CourseId == enrollment.CourseId);
        if (lesson is null) return NotFound(new { error = "Lesson does not belong to this course." });

        var already = await db.LessonProgress.AnyAsync(lp => lp.EnrollmentId == id && lp.LessonId == lessonId);
        if (already) return NoContent();

        db.LessonProgress.Add(new LessonProgress { EnrollmentId = id, LessonId = lessonId });
        await db.SaveChangesAsync();
        //
        // trigger updates enrollments.progress
        return NoContent();
    }

    [HttpPut("api/courses/{courseId:int}/reviews")]
    public async Task<ActionResult<ReviewDto>> UpdateReview(int courseId, CreateReviewRequest req)
    {
        if (req.Grade is < 1 or > 5)
            return BadRequest(new { error = "Grade must be between 1 and 5." });

        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .Include(e => e.Student)
            .SingleOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        if (enrollment is null) return BadRequest(new { error = "You are not enrolled in this course." });

        var review = await db.Reviews.SingleOrDefaultAsync(r => r.EnrollmentId == enrollment.Id);
        if (review is null) return NotFound(new { error = "No review to update." });

        review.Grade = req.Grade;
        review.Comment = req.Comment ?? string.Empty;
        await db.SaveChangesAsync();

        return new ReviewDto(review.Id, review.Grade, review.Comment, review.CreatedAt,
            enrollment.Student!.FirstName, enrollment.Student.LastName);
    }

    [HttpDelete("api/courses/{courseId:int}/reviews")]
    public async Task<IActionResult> DeleteReview(int courseId)
    {
        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .SingleOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        if (enrollment is null) return BadRequest(new { error = "You are not enrolled in this course." });

        var review = await db.Reviews.SingleOrDefaultAsync(r => r.EnrollmentId == enrollment.Id);
        if (review is null) return NoContent();

        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("api/courses/{courseId:int}/reviews")]
    public async Task<ActionResult<ReviewDto>> CreateReview(int courseId, CreateReviewRequest req)
    {
        if (req.Grade is < 1 or > 5)
            return BadRequest(new { error = "Grade must be between 1 and 5." });

        var studentId = CurrentUserId;
        var enrollment = await db.Enrollments
            .Include(e => e.Student)
            .SingleOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        if (enrollment is null) return BadRequest(new { error = "You are not enrolled in this course." });

        if (await db.Reviews.AnyAsync(r => r.EnrollmentId == enrollment.Id))
            return BadRequest(new { error = "You have already reviewed this course." });

        var review = new Review
        {
            EnrollmentId = enrollment.Id,
            Grade = req.Grade,
            Comment = req.Comment ?? string.Empty,
        };
        db.Reviews.Add(review);
        await db.SaveChangesAsync();

        return new ReviewDto(review.Id, review.Grade, review.Comment, review.CreatedAt,
            enrollment.Student!.FirstName, enrollment.Student.LastName);
    }
}
