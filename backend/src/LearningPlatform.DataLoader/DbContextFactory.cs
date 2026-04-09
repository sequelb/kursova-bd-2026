using LearningPlatform.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.DataLoader;

internal static class DbContextFactory
{
    // Matches LearningPlatform.Api/appsettings.Development.json. The loader is
    // a local-dev tool, so hardcoding is fine and avoids reading API config.
    private const string ConnectionString =
        "Host=localhost;Port=5432;Database=learningplatform;Username=bodia";

    public static AppDbContext Create()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(ConnectionString)
            .UseSnakeCaseNamingConvention()
            .Options;
        return new AppDbContext(options);
    }
}
