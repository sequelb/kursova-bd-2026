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

public record EnrollmentDetailDto(
    int Id,
    int CourseId,
    string CourseTitle,
    int Progress,
    DateTime EnrolledAt,
    List<LessonSummaryDto> Lessons,
    List<int> CompletedLessonIds,
    bool HasReview);

public record EnrollResultDto(int EnrollmentId, int? FirstLessonId);

public record CreateReviewRequest(int Grade, string Comment);
