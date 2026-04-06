namespace LearningPlatform.Api.Models;

public static class CourseStatus
{
    public const string Draft = "Draft";
    public const string Published = "Published";
    public static readonly string[] All = [Draft, Published];
}

public static class CourseLevel
{
    public const string Beginner = "Beginner";
    public const string Intermediate = "Intermediate";
    public const string Advanced = "Advanced";
    public static readonly string[] All = [Beginner, Intermediate, Advanced];
}

public class Course
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Level { get; set; } = CourseLevel.Beginner;
    public string Status { get; set; } = CourseStatus.Draft;
    public DateTime CreatedAt { get; set; }

    public TeacherProfile? Author { get; set; }
    public List<Lesson> Lessons { get; set; } = [];
    public List<Category> Categories { get; set; } = [];
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<Course> Courses { get; set; } = [];
}

public class Lesson
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int OrderNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    public Course? Course { get; set; }
}
