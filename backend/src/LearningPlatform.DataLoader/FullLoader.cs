using System.Globalization;
using System.Text.RegularExpressions;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.Configuration.Attributes;
using LearningPlatform.Api.Data;
using LearningPlatform.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.DataLoader;

/// <summary>
/// Loads the Udemy Courses Kaggle dataset into the database.
/// CSV columns: course_id, course_title, url, is_paid, price, num_subscribers,
/// num_reviews, num_lectures, level, content_duration, published_timestamp, subject.
///
/// Data lineage by table:
///   categories       — REAL (distinct `subject` values from CSV)
///   courses          — REAL (every CSV row → 1 course; title/price/level/created_at)
///   lessons          — HYBRID (count from `num_lectures` capped at MaxLessonsPerCourse;
///                              content is generated lorem ipsum)
///   users (teachers) — GENERATED (random names from NamePool, 1/teacher_count of CSV rows)
///   users (students) — GENERATED (random names from NamePool)
///   enrollments      — HYBRID (course is sampled weighted by `num_subscribers`;
///                              student is uniformly random; dates spread over configurable range)
/// </summary>
internal static partial class FullLoader
{
    private const int TeacherCount = 80;
    private const int StudentCount = 500;
    private const int MaxLessonsPerCourse = 8;
    private const int TargetEnrollmentCount = 5000;

    private static readonly string CsvPath = Path.Combine(
        AppContext.BaseDirectory, "data", "courses.csv");

    // Matches strings that contain ONLY basic Latin letters, digits, common punctuation, and whitespace.
    // Rows whose title fails this check are skipped (non-Latin/emoji titles render as tofu).
    [GeneratedRegex(@"^[\x20-\x7E]+$")]
    private static partial Regex AsciiOnlyRegex();

    public static async Task RunAsync(AppDbContext db, int? limit = null,
        DateTime? enrollFromOverride = null, DateTime? enrollToOverride = null)
    {
        if (!File.Exists(CsvPath))
        {
            Console.Error.WriteLine($"ERROR: dataset not found at {CsvPath}");
            Console.Error.WriteLine("Download the Udemy Courses dataset from");
            Console.Error.WriteLine("  https://www.kaggle.com/datasets/andrewmvd/udemy-courses");
            Console.Error.WriteLine("and place courses.csv in the data/ folder.");
            Environment.Exit(2);
        }

        var hasher = new PasswordHasher<User>();
        var rng = new Random(42); // deterministic, makes runs reproducible
        var enrollTo = enrollToOverride ?? DateTime.UtcNow;

        Console.WriteLine("Reading CSV...");
        var allRows = ReadCsv(CsvPath);
        Console.WriteLine($"  ✓ {allRows.Count} rows in file");

        // Filter out rows with non-ASCII titles (render as tofu in the UI)
        var rows = allRows.Where(r =>
            !string.IsNullOrWhiteSpace(r.CourseTitle) && AsciiOnlyRegex().IsMatch(r.CourseTitle)).ToList();
        var skipped = allRows.Count - rows.Count;
        if (skipped > 0)
            Console.WriteLine($"  ⚠ skipped {skipped} rows with non-ASCII titles");

        if (limit is not null && limit < rows.Count)
        {
            Console.WriteLine($"  taking first {limit} (--limit)");
            rows = rows.Take(limit.Value).ToList();
        }

        // ---------- 1. categories (real) ----------
        Console.WriteLine("Inserting categories...");
        var subjectNames = rows
            .Select(r => r.Subject)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s!.Trim())
            .Distinct()
            .ToList();
        var categories = subjectNames.Select(n => new Category { Name = n }).ToList();
        db.Categories.AddRange(categories);
        await db.SaveChangesAsync();
        var categoryByName = categories.ToDictionary(c => c.Name, c => c);
        Console.WriteLine($"  ✓ {categories.Count} categories");

        // ---------- 2. teachers (generated) ----------
        Console.WriteLine("Generating teachers...");
        var teachers = new List<User>();
        var teacherProfiles = new List<TeacherProfile>();
        var usedEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var i = 0; i < TeacherCount; i++)
        {
            var (first, last) = NamePool.Random(rng);
            string email;
            var seq = 0;
            do { email = NamePool.EmailFor(first, last, seq++); } while (!usedEmails.Add(email));
            var u = new User
            {
                FirstName = first,
                LastName = last,
                Email = email,
                Role = Roles.Teacher,
                PasswordHash = hasher.HashPassword(null!, "password123"),
            };
            teachers.Add(u);
        }
        db.Users.AddRange(teachers);
        await db.SaveChangesAsync();
        foreach (var t in teachers)
            teacherProfiles.Add(new TeacherProfile { UserId = t.Id, Bio = "" });
        db.TeacherProfiles.AddRange(teacherProfiles);
        await db.SaveChangesAsync();
        Console.WriteLine($"  ✓ {teachers.Count} teachers");

        // ---------- 3. courses (real) ----------
        Console.WriteLine("Inserting courses...");
        var courses = new List<Course>();
        var courseSubscribers = new List<int>();
        for (var i = 0; i < rows.Count; i++)
        {
            var r = rows[i];

            var teacher = teachers[i % teachers.Count];
            var category = categoryByName.TryGetValue(r.Subject?.Trim() ?? "", out var c) ? c : null;

            var course = new Course
            {
                AuthorId = teacher.Id,
                Title = Truncate(r.CourseTitle!.Trim(), 200),
                Description = $"{r.CourseTitle.Trim()}.\n\nLorem ipsum dolor sit amet, " +
                              "consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut " +
                              "labore et dolore magna aliqua.",
                Price = r.IsPaid ? Math.Max(0m, r.Price) : 0m,
                Level = MapLevel(r.Level),
                Status = CourseStatus.Published,
                CreatedAt = ParseTimestampUtc(r.PublishedTimestamp),
                Categories = category is null ? new List<Category>() : new List<Category> { category },
            };
            courses.Add(course);
            courseSubscribers.Add(Math.Max(1, r.NumSubscribers));
        }

        const int chunkSize = 500;
        for (var i = 0; i < courses.Count; i += chunkSize)
        {
            db.Courses.AddRange(courses.GetRange(i, Math.Min(chunkSize, courses.Count - i)));
            await db.SaveChangesAsync();
            Console.Write($"\r  inserting courses... {Math.Min(i + chunkSize, courses.Count)}/{courses.Count}");
        }
        Console.WriteLine();
        Console.WriteLine($"  ✓ {courses.Count} courses");

        // ---------- 4. lessons (count from CSV, content generated) ----------
        Console.WriteLine("Inserting lessons...");
        var totalLessons = 0;
        for (var i = 0; i < courses.Count; i += chunkSize)
        {
            var batch = new List<Lesson>();
            var end = Math.Min(i + chunkSize, courses.Count);
            for (var j = i; j < end; j++)
            {
                var course = courses[j];
                var rawCount = rows[j].NumLectures;
                var count = Math.Clamp(rawCount, 1, MaxLessonsPerCourse);
                for (var k = 1; k <= count; k++)
                {
                    batch.Add(new Lesson
                    {
                        CourseId = course.Id,
                        OrderNumber = k,
                        Title = $"Topic {k}",
                        Content = $"This is the text content of lesson {k} of \"{course.Title}\". " +
                                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do " +
                                  "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    });
                    totalLessons++;
                }
            }
            db.Lessons.AddRange(batch);
            await db.SaveChangesAsync();
            Console.Write($"\r  inserting lessons... {totalLessons} so far");
        }
        Console.WriteLine();
        Console.WriteLine($"  ✓ {totalLessons} lessons");

        // ---------- 5. students (generated) ----------
        Console.WriteLine("Generating students...");
        var students = new List<User>();
        for (var i = 0; i < StudentCount; i++)
        {
            var (first, last) = NamePool.Random(rng);
            string email;
            var seq = 0;
            do { email = NamePool.EmailFor(first, last, seq++); } while (!usedEmails.Add(email));
            students.Add(new User
            {
                FirstName = first,
                LastName = last,
                Email = email,
                Role = Roles.Student,
                PasswordHash = hasher.HashPassword(null!, "password123"),
            });
        }
        db.Users.AddRange(students);
        await db.SaveChangesAsync();
        Console.WriteLine($"  ✓ {students.Count} students");

        // ---------- 6. enrollments (course weighted by subscribers, student uniform, dates spread) ----------
        Console.WriteLine("Generating enrollments...");
        var totalSubs = courseSubscribers.Aggregate(0L, (acc, s) => acc + s);
        var cum = new long[courseSubscribers.Count];
        long running = 0;
        for (var i = 0; i < courseSubscribers.Count; i++)
        {
            running += courseSubscribers[i];
            cum[i] = running;
        }

        var targetEnrollments = Math.Min(TargetEnrollmentCount, courses.Count * 10);
        var taken = new HashSet<(int sid, int cid)>();
        var enrollmentBatch = new List<Enrollment>();
        var paymentBatch = new List<Payment>();
        var attempts = 0;
        var maxAttempts = targetEnrollments * 4;

        while (taken.Count < targetEnrollments && attempts < maxAttempts)
        {
            attempts++;
            var roll = (long)(rng.NextDouble() * totalSubs);
            var idx = BinarySearchUpper(cum, roll);
            var course = courses[idx];
            var student = students[rng.Next(students.Count)];
            if (!taken.Add((student.Id, course.Id))) continue;

            // Pick a random enrollment date between the course's creation and the
            // configured end date (default: today). This spreads enrollments over time
            // so analytics charts and date-range filters show realistic data.
            var earliest = enrollFromOverride ?? course.CreatedAt;
            var latest = enrollTo;
            if (earliest > latest) earliest = latest; // safety
            var enrolledAt = RandomDateBetween(rng, earliest, latest);

            enrollmentBatch.Add(new Enrollment
            {
                StudentId = student.Id,
                CourseId = course.Id,
                EnrolledAt = enrolledAt,
            });
            paymentBatch.Add(new Payment
            {
                StudentId = student.Id,
                CourseId = course.Id,
                Amount = course.Price,
                Status = PaymentStatus.Completed,
                CreatedAt = enrolledAt,
            });

            if (enrollmentBatch.Count >= chunkSize)
            {
                db.Enrollments.AddRange(enrollmentBatch);
                db.Payments.AddRange(paymentBatch);
                await db.SaveChangesAsync();
                Console.Write($"\r  inserting enrollments... {taken.Count}/{targetEnrollments}");
                enrollmentBatch.Clear();
                paymentBatch.Clear();
            }
        }
        if (enrollmentBatch.Count > 0)
        {
            db.Enrollments.AddRange(enrollmentBatch);
            db.Payments.AddRange(paymentBatch);
            await db.SaveChangesAsync();
        }
        Console.WriteLine();
        Console.WriteLine($"  ✓ {taken.Count} enrollments (and matching payments)");

        Console.WriteLine();
        Console.WriteLine("Done.");
        Console.WriteLine($"  Total records inserted (approx): " +
                          $"{categories.Count + teachers.Count + students.Count + courses.Count + totalLessons + taken.Count}");
    }

    // ---- helpers ----

    private static List<UdemyRow> ReadCsv(string path)
    {
        using var reader = new StreamReader(path);
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            BadDataFound = null,
        };
        using var csv = new CsvReader(reader, config);
        return csv.GetRecords<UdemyRow>().ToList();
    }

    private static string MapLevel(string? raw) => raw?.Trim() switch
    {
        "Beginner Level" => CourseLevel.Beginner,
        "Intermediate Level" => CourseLevel.Intermediate,
        "Expert Level" => CourseLevel.Advanced,
        "All Levels" => CourseLevel.Beginner,
        _ => CourseLevel.Beginner,
    };

    private static DateTime ParseTimestampUtc(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return DateTime.UtcNow;
        if (DateTime.TryParse(raw, CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var dt))
            return DateTime.SpecifyKind(dt, DateTimeKind.Utc);
        return DateTime.UtcNow;
    }

    private static DateTime RandomDateBetween(Random rng, DateTime from, DateTime to)
    {
        var range = (to - from).TotalSeconds;
        if (range <= 0) return from;
        var offset = rng.NextDouble() * range;
        return DateTime.SpecifyKind(from.AddSeconds(offset), DateTimeKind.Utc);
    }

    private static string Truncate(string s, int max) =>
        s.Length <= max ? s : s.Substring(0, max);

    private static int BinarySearchUpper(long[] cum, long target)
    {
        int lo = 0, hi = cum.Length - 1;
        while (lo < hi)
        {
            var mid = (lo + hi) / 2;
            if (cum[mid] <= target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    // ---- CSV row mapping ----

    private sealed class UdemyRow
    {
        [Name("course_id")] public int CourseId { get; set; }
        [Name("course_title")] public string? CourseTitle { get; set; }
        [Name("url")] public string? Url { get; set; }
        [Name("is_paid")] public bool IsPaid { get; set; }
        [Name("price")] public decimal Price { get; set; }
        [Name("num_subscribers")] public int NumSubscribers { get; set; }
        [Name("num_reviews")] public int NumReviews { get; set; }
        [Name("num_lectures")] public int NumLectures { get; set; }
        [Name("level")] public string? Level { get; set; }
        [Name("content_duration")] public decimal ContentDuration { get; set; }
        [Name("published_timestamp")] public string? PublishedTimestamp { get; set; }
        [Name("subject")] public string? Subject { get; set; }
    }
}
