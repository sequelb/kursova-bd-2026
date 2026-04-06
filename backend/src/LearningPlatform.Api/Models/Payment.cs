namespace LearningPlatform.Api.Models;

public static class PaymentStatus
{
    public const string Completed = "Completed";
    public const string Refunded = "Refunded";
    public static readonly string[] All = [Completed, Refunded];
}

public static class PayoutStatus
{
    public const string Pending = "Pending";
    public const string Approved = "Approved";
    public const string Rejected = "Rejected";
    public const string Paid = "Paid";
    public static readonly string[] All = [Pending, Approved, Rejected, Paid];
}

public class Payment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = PaymentStatus.Completed;
    public DateTime CreatedAt { get; set; }

    public User? Student { get; set; }
    public Course? Course { get; set; }
}

public class Payout
{
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = PayoutStatus.Pending;
    public DateTime RequestedAt { get; set; }

    public TeacherProfile? Teacher { get; set; }
}
