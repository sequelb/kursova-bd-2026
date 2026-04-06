using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher<User>>();

        await SeedAdmin(db, hasher);
        if (await db.Courses.AnyAsync()) return; // dev seed only on empty DB
        await SeedDevContent(db, hasher);
    }

    private static async Task SeedAdmin(AppDbContext db, IPasswordHasher<User> hasher)
    {
        const string adminEmail = "admin@local";
        if (await db.Users.AnyAsync(u => u.Email == adminEmail)) return;

        var admin = new User
        {
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            Role = Roles.Admin,
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");
        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }

    private static async Task SeedDevContent(AppDbContext db, IPasswordHasher<User> hasher)
    {
        // ---- categories ----
        var catNames = new[] { "Programming", "JavaScript", "Web Development", "Data Science", "Design" };
        var categories = catNames.Select(n => new Category { Name = n }).ToList();
        db.Categories.AddRange(categories);

        // ---- teachers ----
        var sarah = MakeUser(hasher, "sarah@local", "Sarah", "Johnson", Roles.Teacher);
        var john = MakeUser(hasher, "john@local", "John", "Smith", Roles.Teacher);
        db.Users.AddRange(sarah, john);
        await db.SaveChangesAsync();

        var sarahProfile = new TeacherProfile { UserId = sarah.Id, Bio = "Frontend engineer." };
        var johnProfile = new TeacherProfile { UserId = john.Id, Bio = "Backend & data." };
        db.TeacherProfiles.AddRange(sarahProfile, johnProfile);

        // ---- student ----
        var alice = MakeUser(hasher, "alice@local", "Alice", "Brown", Roles.Student);
        db.Users.Add(alice);
        await db.SaveChangesAsync();

        // ---- courses ----
        Course MakeCourse(int authorId, string title, decimal price, string level, params string[] cats) =>
            new()
            {
                AuthorId = authorId,
                Title = title,
                Description = $"Lorem ipsum dolor sit amet — {title}. " +
                              "Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                Price = price,
                Level = level,
                Status = CourseStatus.Published,
                Categories = categories.Where(c => cats.Contains(c.Name)).ToList(),
            };

        var courses = new[]
        {
            MakeCourse(sarah.Id, "React for Beginners", 49.99m, CourseLevel.Beginner, "JavaScript", "Web Development"),
            MakeCourse(sarah.Id, "Advanced JavaScript Concepts", 79.99m, CourseLevel.Advanced, "JavaScript", "Programming"),
            MakeCourse(sarah.Id, "UI/UX Design Fundamentals", 59.99m, CourseLevel.Beginner, "Design"),
            MakeCourse(john.Id, "Python Programming Basics", 39.99m, CourseLevel.Beginner, "Programming"),
            MakeCourse(john.Id, "Python for Data Science", 89.99m, CourseLevel.Intermediate, "Programming", "Data Science"),
            MakeCourse(john.Id, "Database Management Systems", 54.99m, CourseLevel.Intermediate, "Programming"),
        };
        db.Courses.AddRange(courses);
        await db.SaveChangesAsync();

        // ---- lessons (4 per course) ----
        foreach (var course in courses)
        {
            for (var i = 1; i <= 4; i++)
            {
                db.Lessons.Add(new Lesson
                {
                    CourseId = course.Id,
                    OrderNumber = i,
                    Title = $"Topic {i}",
                    Content = $"This is the text content of lesson {i} of \"{course.Title}\". " +
                              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                });
            }
        }
        await db.SaveChangesAsync();

        // ---- one enrollment + review for Alice on React for Beginners (so the catalog has rating data) ----
        var react = courses[0];
        var enrollment = new Enrollment { StudentId = alice.Id, CourseId = react.Id };
        db.Enrollments.Add(enrollment);
        db.Payments.Add(new Payment { StudentId = alice.Id, CourseId = react.Id, Amount = react.Price, Status = PaymentStatus.Completed });
        sarahProfile.Balance += react.Price;
        await db.SaveChangesAsync();

        db.Reviews.Add(new Review
        {
            EnrollmentId = enrollment.Id,
            Grade = 5,
            Comment = "This course was excellent! Highly recommend.",
        });
        await db.SaveChangesAsync();
    }

    private static User MakeUser(IPasswordHasher<User> hasher, string email, string first, string last, string role)
    {
        var u = new User { Email = email, FirstName = first, LastName = last, Role = role };
        u.PasswordHash = hasher.HashPassword(u, "Passw0rd!");
        return u;
    }
}
