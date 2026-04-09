using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Data;

/// <summary>
/// Runs on app startup. Only ensures the admin user exists — it deliberately
/// does NOT seed any content. Demo content (and the full Udemy dataset) is
/// loaded by the standalone <c>LearningPlatform.DataLoader</c> project.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher<User>>();

        const string adminEmail = "admin@local";
        if (await db.Users.AnyAsync(u => u.Email == adminEmail)) return;

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
    }
}
