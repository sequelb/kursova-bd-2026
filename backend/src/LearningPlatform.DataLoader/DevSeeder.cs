using LearningPlatform.Api.Data;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace LearningPlatform.DataLoader;

internal static class DevSeeder
{
    public static async Task RunAsync(AppDbContext db)
    {
        var hasher = new PasswordHasher<User>();

        Console.WriteLine("Seeding dev content (small fixture)...");

        // categories 
        var catNames = new[] { "Programming", "JavaScript", "Web Development", "Data Science", "Design" };
        var categories = catNames.Select(n => new Category { Name = n }).ToList();
        db.Categories.AddRange(categories);

        // teachers 
        var sarah = MakeUser(hasher, "sarah@local", "Sarah", "Johnson", Roles.Teacher);
        var john = MakeUser(hasher, "john@local", "John", "Smith", Roles.Teacher);
        db.Users.AddRange(sarah, john);
        await db.SaveChangesAsync();

        db.TeacherProfiles.AddRange(
            new TeacherProfile { UserId = sarah.Id, Bio = "Frontend engineer." },
            new TeacherProfile { UserId = john.Id, Bio = "Backend & data." });

        // student 
        var alice = MakeUser(hasher, "alice@local", "Alice", "Brown", Roles.Student);
        db.Users.Add(alice);
        await db.SaveChangesAsync();

        // courses 
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

        // lessons (4 percourse)
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

        // one enrollment + review for alice on React for Beginners (so that catalog has rating data) 
        var react = courses[0];
        var enrollment = new Enrollment { StudentId = alice.Id, CourseId = react.Id };
        db.Enrollments.Add(enrollment);
        db.Payments.Add(new Payment
        {
            StudentId = alice.Id,
            CourseId = react.Id,
            Amount = react.Price,
            Status = PaymentStatus.Completed,
        });
        await db.SaveChangesAsync();

        db.Reviews.Add(new Review
        {
            EnrollmentId = enrollment.Id,
            Grade = 5,
            Comment = "This course was excellent! Highly recommend.",
        });
        await db.SaveChangesAsync();

        Console.WriteLine($"  ✓ {categories.Count} categories");
        Console.WriteLine("  ✓ 2 teachers (sarah@local, john@local — password: password123)");
        Console.WriteLine("  ✓ 1 student  (alice@local — password: password123)");
        Console.WriteLine($"  ✓ {courses.Length} courses, {courses.Length * 4} lessons");
        Console.WriteLine("  ✓ 1 enrollment + 1 review");
    }

    private static User MakeUser(IPasswordHasher<User> hasher, string email, string first, string last, string role)
    {
        var u = new User { Email = email, FirstName = first, LastName = last, Role = role };
        u.PasswordHash = hasher.HashPassword(u, "password123");
        return u;
    }
}
