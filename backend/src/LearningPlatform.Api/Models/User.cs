namespace LearningPlatform.Api.Models;

public static class Roles
{
    public const string Admin = "Admin";
    public const string Teacher = "Teacher";
    public const string Student = "Student";

    public static readonly string[] All = [Admin, Teacher, Student];
    public static readonly string[] SelfRegisterable = [Teacher, Student];
}

public static class UserStatus
{
    public const string Active = "Active";
    public const string Suspended = "Suspended";

    public static readonly string[] All = [Active, Suspended];
}

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Student;
    public string Status { get; set; } = UserStatus.Active;

    public TeacherProfile? TeacherProfile { get; set; }
}

public class TeacherProfile
{
    public int UserId { get; set; }
    public string Bio { get; set; } = string.Empty;
    public decimal Balance { get; set; }

    public User? User { get; set; }
}
