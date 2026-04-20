namespace LearningPlatform.Api.Models;

public class Enrollment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public int Progress { get; set; }

    public User? Student { get; set; }
    public Course? Course { get; set; }
    public List<LessonProgress> LessonProgress { get; set; } = [];
    public Review? Review { get; set; }
}

public class LessonProgress
{
    public int EnrollmentId { get; set; }
    public int LessonId { get; set; }
    public DateTime CompletedAt { get; set; }

    public Enrollment? Enrollment { get; set; }
    public Lesson? Lesson { get; set; }
}

public class Review
{
    public int EnrollmentId { get; set; }
    public int Grade { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Enrollment? Enrollment { get; set; }
}
