using LearningPlatform.Api.Data;
using LearningPlatform.Api.Models;
using LearningPlatform.DataLoader;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

// ---- arg parsing ----
var dev = args.Contains("--dev");
var reset = args.Contains("--reset");
var help = args.Contains("--help") || args.Contains("-h");

int? limit = null;
for (var i = 0; i < args.Length; i++)
{
    if (args[i] == "--limit" && i + 1 < args.Length && int.TryParse(args[i + 1], out var parsed) && parsed > 0)
    {
        limit = parsed;
    }
}

if (help)
{
    PrintHelp();
    return 0;
}

await using var db = DbContextFactory.Create();

// ---- ensure schema is up to date ----
Console.WriteLine("Applying any pending migrations...");
await db.Database.MigrateAsync();

// ---- check existing data ----
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

// ---- ensure admin exists ----
await EnsureAdminAsync(db);

// ---- run the chosen mode ----
if (dev)
    await DevSeeder.RunAsync(db);
else
    await FullLoader.RunAsync(db, limit);

return 0;

// ---- locals ----

static void PrintHelp()
{
    Console.WriteLine("LearningPlatform.DataLoader");
    Console.WriteLine();
    Console.WriteLine("Modes:");
    Console.WriteLine("  (no flag)        Load the full Udemy CSV (~3700 courses, ~5000 enrollments)");
    Console.WriteLine("  --dev            Load the small hardcoded dev seed (sarah/john/alice + 6 courses)");
    Console.WriteLine();
    Console.WriteLine("Flags:");
    Console.WriteLine("  --reset          Wipe existing content first (skips the confirm prompt)");
    Console.WriteLine("  --limit N        Only import the first N rows from the CSV (full mode)");
    Console.WriteLine("  -h, --help       Show this help");
    Console.WriteLine();
    Console.WriteLine("Examples:");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader -- --dev");
    Console.WriteLine("  dotnet run --project src/LearningPlatform.DataLoader -- --reset --dev");
}

static async Task ResetAsync(AppDbContext db)
{
    Console.WriteLine("Wiping existing content...");
    // Order matters: child tables first. The schema's cascade rules clean up
    // lesson_progress and reviews automatically when enrollments go.
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
    // Keep the admin user; delete all other users.
    await db.Database.ExecuteSqlRawAsync($"DELETE FROM users WHERE role <> '{Roles.Admin}'");
    Console.WriteLine("  ✓ wiped");
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
    Console.WriteLine($"  ✓ created admin user ({adminEmail} / admin123)");
}
