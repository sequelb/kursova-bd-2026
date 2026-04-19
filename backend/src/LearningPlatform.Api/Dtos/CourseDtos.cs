namespace LearningPlatform.Api.Dtos;

public record CategoryDto(int Id, string Name);

public record AuthorDto(int Id, string FirstName, string LastName);

public record CourseListItemDto(
    int Id,
    string Title,
    decimal Price,
    string Level,
    DateTime CreatedAt,
    AuthorDto Author,
    List<CategoryDto> Categories,
    double AverageRating,
    int ReviewCount,
    int EnrollmentCount);

public record LessonSummaryDto(int Id, int OrderNumber, string Title);

public record ReviewDto(
    int Id,
    int Grade,
    string Comment,
    DateTime CreatedAt,
    string StudentFirstName,
    string StudentLastName);

public record CourseDetailDto(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string Level,
    string Status,
    DateTime CreatedAt,
    AuthorDto Author,
    List<CategoryDto> Categories,
    List<LessonSummaryDto> Lessons,
    List<ReviewDto> Reviews,
    double AverageRating,
    int EnrollmentCount);

public record RecommendedCourseDto(
    int Id,
    string Title,
    decimal Price,
    string Level,
    DateTime CreatedAt,
    AuthorDto Author,
    List<CategoryDto> Categories,
    double AverageRating,
    int ReviewCount,
    int EnrollmentCount,
    double Score,
    double Confidence,
    double Lift,
    string Reason);

public record CourseQuery(
    string? Q,
    int[]? CategoryIds,
    decimal? MinPrice,
    decimal? MaxPrice,
    double? MinRating,
    double? MaxRating,
    DateTime? CreatedAfter,
    DateTime? CreatedBefore,
    string? Sort,
    int Page = 1,
    int PageSize = 12);
