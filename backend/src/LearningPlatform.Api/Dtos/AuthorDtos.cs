namespace LearningPlatform.Api.Dtos;

public record AuthorPublicCourseDto(
    int Id,
    string Title,
    decimal Price,
    string Level,
    DateTime CreatedAt,
    double AverageRating,
    int ReviewCount);

public record AuthorPublicDto(
    int Id,
    string FirstName,
    string LastName,
    string Bio,
    List<AuthorPublicCourseDto> Courses);
