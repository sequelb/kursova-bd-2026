using LearningPlatform.Api.Data;
using LearningPlatform.Api.Models;
using LearningPlatform.DataLoader;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

// arg parsing
var dev = args.Contains("--dev");
var reset = args.Contains("--reset");
var help = args.Contains("--help") || args.Contains("-h");

int? limit = null;
DateTime? enrollFrom = null;
DateTime? enrollTo = null;

for (var i = 0; i < args.Length; i++)
{
    if (args[i] == "--limit" && i + 1 < args.Length && int.TryParse(args[i + 1], out var parsed) && parsed > 0)
        limit = parsed;
    if (args[i] == "--enroll-from" && i + 1 < args.Length && DateTime.TryParse(args[i + 1], out var ef))
        enrollFrom = DateTime.SpecifyKind(ef.Date, DateTimeKind.Utc);
    if (args[i] == "--enroll-to" && i + 1 < args.Length && DateTime.TryParse(args[i + 1], out var et))
        enrollTo = DateTime.SpecifyKind(et.Date, DateTimeKind.Utc);
}

if (help)
{
    PrintHelp();
    return 0;
}

await using var db = DbContextFactory.Create();

Console.WriteLine("applying any pending migrations...");
await db.Database.MigrateAsync();

// check for any existing data 
var hasContent = await db.Courses.AnyAsync() || await db.Users.CountAsync(u => u.Role != Roles.Admin) > 0;

if (hasContent)
{
    if (!reset)
    {
        Console.WriteLine("Database already contains content (courses or non-admin users).");
        Console.Write("Reset and repopulate? [y/N]: ");
        var answer = Console.ReadLine()?.Trim().ToLowerInvariant();
        if (answer != "y" && answer != "yes")
        {
            Console.WriteLine("Aborted. Re-run with --reset to skip this prompt.");
            return 1;
        }
    }
    await ResetAsync(db);
}

await EnsureAdminAsync(db);

    await FullLoader.RunAsync(db, limit, enrollFrom, enrollTo);

return 0;

// locals

static void PrintHelp()
{
    Console.WriteLine("flags:");
    Console.WriteLine("  --reset              wipe existing content first ");
    Console.WriteLine("  --limit N            only import the first N rows from csv ");
    Console.WriteLine("  --enroll-from DATE   earliest enrollment date (default : course's publication date)");
    Console.WriteLine("  --enroll-to DATE     latest enrollment date (default: today)");
    Console.WriteLine("  -h, --help           show this help");
    Console.WriteLine();
    Console.WriteLine("examples:");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader -- --reset --limit 500");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader -- --reset --enroll-from 2025-01-01 --enroll-to 2026-04-01");
}

static async Task ResetAsync(AppDbContext db)
{
    Console.WriteLine("Wiping existing content...");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM lesson_progress");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM reviews");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM enrollments");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM payments");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM payouts");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM lessons");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM course_categories");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM courses");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM categories");
    await db.Database.ExecuteSqlRawAsync("DELETE FROM teacher_profiles");
    await db.Database.ExecuteSqlRawAsync($"DELETE FROM users WHERE role <> '{Roles.Admin}'");
    Console.WriteLine(" + wiped");
}

static async Task EnsureAdminAsync(AppDbContext db)
{
    const string adminEmail = "admin@local";
    if (await db.Users.AnyAsync(u => u.Email == adminEmail)) return;

    var hasher = new PasswordHasher<User>();
    var admin = new User
    {
        Email = adminEmail,
        FirstName = "Admin",
        LastName = "User",
        Role = Roles.Admin,
    };
    admin.PasswordHash = hasher.HashPassword(admin, "admin123");
    db.Users.Add(admin);
    await db.SaveChangesAsync();
    Console.WriteLine($" + created admin user ({adminEmail} / admin123)");
}
