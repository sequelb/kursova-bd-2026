using System.ComponentModel.DataAnnotations;

namespace LearningPlatform.Api.Dtos;

// coursess

public record TeacherCourseListItemDto(
    int Id,
    string Title,
    string Status,
    string Level,
    decimal Price,
    int EnrollmentCount,
    double AverageRating,
    int LessonCount,
    DateTime CreatedAt);

public record LessonEditDto(int Id, int OrderNumber, string Title, string Content);

public record TeacherCourseDetailDto(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string Level,
    string Status,
    DateTime CreatedAt,
    List<CategoryDto> Categories,
    List<LessonEditDto> Lessons);

public record CreateCourseRequest(
    [Required, MinLength(1), MaxLength(200)] string Title,
    [Required, MinLength(1), MaxLength(4000)] string Description,
    [Range(0, 9999)] decimal Price,
    [Required] string Level,
    int[] CategoryIds);

public record UpdateCourseRequest(
    [Required, MinLength(1), MaxLength(200)] string Title,
    [Required, MinLength(1), MaxLength(4000)] string Description,
    [Range(0, 9999)] decimal Price,
    [Required] string Level,
    int[] CategoryIds);

public record CreateLessonRequest(
    [Required, MinLength(1), MaxLength(200)] string Title,
    [Required, MinLength(1), MaxLength(50000)] string Content);
public record UpdateLessonRequest(
    [Required, MinLength(1), MaxLength(200)] string Title,
    [Required, MinLength(1), MaxLength(50000)] string Content);
public record ReorderLessonsRequest([Required] int[] LessonIds);

// analytics 

public record AnalyticsRecentStudentDto(string FirstName, string LastName, DateTime EnrolledAt, int Progress);

public record CourseAnalyticsDto(
    int CourseId,
    string CourseTitle,
    int EnrollmentCount,
    decimal Revenue,
    double AverageRating,
    double CompletionRate,
    List<AnalyticsRecentStudentDto> RecentStudents);

public record TimelinePointDto(DateTime Date, int Count);

// reviews

public record TeacherReviewDto(
    int CourseId,
    string CourseTitle,
    string StudentFirstName,
    string StudentLastName,
    int Grade,
    string Comment,
    DateTime CreatedAt);

// earnings payouts 

public record PayoutHistoryItemDto(int Id, decimal Amount, string Status, DateTime RequestedAt);

public record EarningsDto(decimal Balance, List<PayoutHistoryItemDto> History);

public record CreatePayoutRequest([Range(0.01, 999999)] decimal Amount);

// teacher_profile 

public record MyTeacherProfileDto(string Bio, decimal Balance);
public record UpdateMyTeacherProfileRequest([MaxLength(2000)] string Bio);
