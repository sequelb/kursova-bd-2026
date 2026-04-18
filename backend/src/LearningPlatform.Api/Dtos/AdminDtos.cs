namespace LearningPlatform.Api.Dtos;

// ---- finance dashboard ----

public record AdminFinanceDashboardDto(
    decimal GrossRevenue,
    decimal TotalRefunds,
    decimal PaidToTeachers,
    decimal PendingPayoutsAmount,
    int PendingPayoutsCount,
    List<TimelinePointMoneyDto> RevenueTimeline,
    List<TimelinePointMoneyDto> PayoutsTimeline);

public record TimelinePointMoneyDto(DateTime Date, decimal Amount);

// ---- payments ----

public record AdminPaymentDto(
    int Id,
    DateTime CreatedAt,
    int StudentId,
    string StudentName,
    string StudentEmail,
    int CourseId,
    string CourseTitle,
    decimal Amount,
    string Status);

// ---- payouts ----

public record AdminPayoutDto(
    int Id,
    DateTime RequestedAt,
    int TeacherId,
    string TeacherName,
    string TeacherEmail,
    decimal Amount,
    string Status);

// ---- users ----

public record AdminUserDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    string Status);

public record UpdateUserStatusRequest(string Status);
