using System.ComponentModel.DataAnnotations;

namespace LearningPlatform.Api.Dtos;

public record EnrollmentListItemDto(
    int Id,
    int CourseId,
    string CourseTitle,
    int Progress,
    int? NextLessonId,
    DateTime EnrolledAt);

public record LessonProgressDto(int LessonId, bool Completed);

public record LessonContentDto(int Id, int OrderNumber, string Title, string Content);

public record MyReviewDto(int Id, int Grade, string Comment, DateTime CreatedAt);

public record EnrollmentDetailDto(
    int Id,
    int CourseId,
    string CourseTitle,
    int Progress,
    DateTime EnrolledAt,
    List<LessonSummaryDto> Lessons,
    List<int> CompletedLessonIds,
    MyReviewDto? MyReview);

public record EnrollResultDto(int EnrollmentId, int? FirstLessonId);

public record CreateReviewRequest([Range(1, 5)] int Grade, [MaxLength(2000)] string Comment);
