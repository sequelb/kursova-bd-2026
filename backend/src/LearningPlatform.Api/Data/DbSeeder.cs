using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Data;

//not used anymore
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
