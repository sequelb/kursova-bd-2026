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

internal static partial class FullLoader
{
    private const int CoursesPerTeacher = 6;   // target avg
    private const int StudentsPerCourse = 5;    // target avg enrollments per course
    private const int MaxLessonsPerCourse = 8;
    private const double ReviewProbability = 0.8; // 80% of enrollments have a review

    private static readonly string CsvPath = Path.Combine(
        AppContext.BaseDirectory, "data", "courses.csv");

    // ?
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
            Environment.Exit(1);
        }

        var hasher = new PasswordHasher<User>();
        var rng = new Random(42);
        var enrollTo = enrollToOverride ?? DateTime.UtcNow;

        Console.WriteLine("Reading CSV...");
        var allRows = ReadCsv(CsvPath);
        Console.WriteLine($"  + {allRows.Count} rows in file");

        // filter out the rows with invalid (non ascii) titles 
        var rows = allRows.Where(r =>
            !string.IsNullOrWhiteSpace(r.CourseTitle) && AsciiOnlyRegex().IsMatch(r.CourseTitle)).ToList();
        var skipped = allRows.Count - rows.Count;
        if (skipped > 0)
            Console.WriteLine($"    skipped {skipped} rows with non ascii titles");

        if (limit is not null && limit < rows.Count)
        {
            Console.WriteLine($"  taking first {limit}rows (--limit)");
            rows = [.. rows.Take(limit.Value)];
        }

        // categories 
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
        Console.WriteLine($"  + {categories.Count} categories");

        // teachers 

        // teacher count is based on course count 
        // each teacher has ~CoursesPerTeacher courses.

        var teacherCount = Math.Max(50, rows.Count / CoursesPerTeacher);
        Console.WriteLine($"Generating {teacherCount} teachers...");

        var teachers = new List<User>();
        var teacherCategories = new List<int>(); // parallel: each teacher's primary category id
        var usedEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        for (var i = 0; i < teacherCount; i++)
        {
            var (first, last) = NamePool.Random(rng);
            string email;
            var seq = 0;
            do { email = NamePool.EmailFor(first, last, seq++); } while (!usedEmails.Add(email));
            teachers.Add(new User
            {
                FirstName = first,
                LastName = last,
                Email = email,
                Role = Roles.Teacher,
                PasswordHash = hasher.HashPassword(null!, "password123"),
            });
            // Each teacher specializes in one category
            teacherCategories.Add(categories[i % categories.Count].Id);
        }

        db.Users.AddRange(teachers);
        await db.SaveChangesAsync();

        var teacherProfiles = new List<TeacherProfile>();
        foreach (var t in teachers)
            teacherProfiles.Add(new TeacherProfile { UserId = t.Id, Bio = "" });

        db.TeacherProfiles.AddRange(teacherProfiles);
        await db.SaveChangesAsync();

        Console.WriteLine($"  + {teachers.Count} teachers (~{rows.Count / teacherCount} courses each)");

        // category -> teachers lookup index  for course assignment
        var teachersByCategory = new Dictionary<int, List<int>>(); // categoryId: [teacherIds]
        for (var i = 0; i < teachers.Count; i++)
        {
            var catId = teacherCategories[i];
            if (!teachersByCategory.TryGetValue(catId, out var list))
            {
                list = new List<int>();
                teachersByCategory[catId] = list;
            }
            list.Add(i);
        }

        //  courses 


        Console.WriteLine("inserting courses...");

        var courses = new List<Course>();
        for (var i = 0; i < rows.Count; i++)
        {
            var r = rows[i];

            var category = categoryByName.TryGetValue(r.Subject?.Trim() ?? "", out var c) ? c : null;

            // assign the course to a teacher who specializes in this category
            // 10% of courses go to a random teacher

            int teacherIdx;
            if (category is not null && rng.NextDouble() > 0.1
                && teachersByCategory.TryGetValue(category.Id, out var categoryTeachers) && categoryTeachers.Count > 0)
            {
                teacherIdx = categoryTeachers[rng.Next(categoryTeachers.Count)];
            }
            else
            {
                teacherIdx = rng.Next(teachers.Count);
            }

            var course = new Course
            {
                AuthorId = teachers[teacherIdx].Id,
                Title = Truncate(r.CourseTitle!.Trim(), 200),
                Description = $"{r.CourseTitle.Trim()}.\n\nDescription for the course. Lorem Ipsum sit amet.",
                Price = r.IsPaid ? Math.Max(0m, r.Price) : 0m,
                Level = MapLevel(r.Level),
                Status = CourseStatus.Published,
                CreatedAt = ParseTimestampUtc(r.PublishedTimestamp),
                Categories = category is null ? [] : [category],
            };
            courses.Add(course);
        }

        const int chunkSize = 500;
        for (var i = 0; i < courses.Count; i += chunkSize)
        {
            db.Courses.AddRange(courses.GetRange(i, Math.Min(chunkSize, courses.Count - i)));
            await db.SaveChangesAsync();
            Console.Write($"\r  inserting courses... {Math.Min(i + chunkSize, courses.Count)}/{courses.Count}");
        }
        Console.WriteLine();
        Console.WriteLine($"  + {courses.Count} courses");


        // lessons 


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
        Console.WriteLine($"  + {totalLessons} lessons");


        // students 


        var studentCount = Math.Max(100, rows.Count / 2);
        Console.WriteLine($"Generating {studentCount} students...");
        var students = new List<User>();

        // each student has 1-2 preferred categories
        // 70% of their enrollments are biased towards courses in those categories
        // 30% random

        var studentPreferences = new List<HashSet<int>>(); // categoryId sets, parallel with students
        for (var i = 0; i < studentCount; i++)
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

            var prefCount = rng.Next(1, 3); // 1 or 2 favourite categories
            var prefs = new HashSet<int>();
            while (prefs.Count < prefCount && prefs.Count < categories.Count)
                prefs.Add(categories[rng.Next(categories.Count)].Id);
            studentPreferences.Add(prefs);
        }

        db.Users.AddRange(students);
        await db.SaveChangesAsync();

        Console.WriteLine($"  + {students.Count} students (each with 1-2 preferred categories)");

        var targetEnrollmentsCount = Math.Min(courses.Count * StudentsPerCourse, students.Count * 30);

        // category -> course index  for enrollment with bias
        var coursesByCategory = new Dictionary<int, List<int>>(); // categoryId: [courseIndexes]
        for (var i = 0; i < courses.Count; i++)
        {
            foreach (var cat in courses[i].Categories)
            {
                if (!coursesByCategory.TryGetValue(cat.Id, out var list))
                {
                    list = new List<int>();
                    coursesByCategory[cat.Id] = list;
                }
                list.Add(i);
            }
        }

        // enrollments 


        Console.WriteLine("Generating enrollments...");
        var taken = new HashSet<(int sid, int cid)>();
        var enrollmentList = new List<(Enrollment e, Payment p)>();
        var attempts = 0;
        var maxAttempts = targetEnrollmentsCount * 4;

        while (taken.Count < targetEnrollmentsCount && attempts < maxAttempts)
        {
            attempts++;
            var studentIdx = rng.Next(students.Count);
            var student = students[studentIdx];
            var prefs = studentPreferences[studentIdx];

            int courseIdx;
            if (rng.NextDouble() < 0.7 && prefs.Count > 0 && coursesByCategory.Count > 0)
            {
                // 70% chance  to pick a course from a preferred category
                var prefCatId = prefs.ElementAt(rng.Next(prefs.Count));
                // take random course with the category
                if (coursesByCategory.TryGetValue(prefCatId, out var catCourses) && catCourses.Count > 0)
                    courseIdx = catCourses[rng.Next(catCourses.Count)];
                else
                    courseIdx = rng.Next(courses.Count); // fallback
            }
            else
            {
                // 30% chance to pick any random course
                courseIdx = rng.Next(courses.Count);
            }

            var course = courses[courseIdx];
            if (!taken.Add((student.Id, course.Id))) continue;

            var earliest = enrollFromOverride ?? course.CreatedAt;
            var latest = enrollTo;
            if (earliest > latest) earliest = latest;
            var enrolledAt = RandomDateBetween(rng, earliest, latest);

            var enrollment = new Enrollment
            {
                StudentId = student.Id,
                CourseId = course.Id,
                EnrolledAt = enrolledAt,
            };
            var payment = new Payment
            {
                StudentId = student.Id,
                CourseId = course.Id,
                Amount = course.Price,
                Status = PaymentStatus.Completed,
                CreatedAt = enrolledAt,
            };

            enrollmentList.Add((enrollment, payment));

            if (enrollmentList.Count >= chunkSize)
            {
                db.Enrollments.AddRange(enrollmentList.Select(x => x.e));
                db.Payments.AddRange(enrollmentList.Select(x => x.p));
                await db.SaveChangesAsync();
                Console.Write($"\r  inserting enrollments... {taken.Count}/{targetEnrollmentsCount}");
                enrollmentList.Clear();
            }
        }

        db.Enrollments.AddRange(enrollmentList.Select(x => x.e));
        db.Payments.AddRange(enrollmentList.Select(x => x.p));
        await db.SaveChangesAsync();

        Console.WriteLine();
        Console.WriteLine($"  + {taken.Count} enrollments (and matching payments)");


        // lesson progress 


        Console.WriteLine("Generating lesson progress...");


        // courseId -> lessonIds map
        var lessonsByCourse = await db.Lessons
            .GroupBy(l => l.CourseId)
            .ToDictionaryAsync(g => g.Key, g => g.Select(l => l.Id).ToList());

        var allEnrollments = await db.Enrollments.ToListAsync();
        var progressBatch = new List<LessonProgress>();
        var totalProgress = 0;

        foreach (var enrollment in allEnrollments)
        {
            if (!lessonsByCourse.TryGetValue(enrollment.CourseId, out var lessonIds)) continue;

            var completionRatio = rng.NextDouble();
            // completionRatio = Math.Min(1.0, completionRatio);

            var lessonsToComplete = (int)(lessonIds.Count * completionRatio);

            for (var i = 0; i < lessonsToComplete; i++)
            {
                var completedAt = RandomDateBetween(rng, enrollment.EnrolledAt, enrollTo);
                progressBatch.Add(new LessonProgress
                {
                    EnrollmentId = enrollment.Id,
                    LessonId = lessonIds[i],
                    CompletedAt = completedAt,
                });
                totalProgress++;
            }

            if (progressBatch.Count >= chunkSize)
            {
                db.LessonProgress.AddRange(progressBatch);
                await db.SaveChangesAsync();
                Console.Write($"\r  inserting lesson progress... {totalProgress} so far");
                progressBatch.Clear();
            }
        }
        if (progressBatch.Count > 0)
        {
            db.LessonProgress.AddRange(progressBatch);
            await db.SaveChangesAsync();
        }
        Console.WriteLine();
        Console.WriteLine($"  + {totalProgress} lesson progress records");


        //  reviews 


        Console.WriteLine("Generating reviews...");
        var reviewComments = new[]
        {
            "Great course! Learned a lot and would recommend to anyone interested in this topic.",
            "Good content but could use more practical examples.",
            "Excellent! The instructor explains everything clearly.",
            "Decent course. Some parts felt a bit rushed.",
            "Very well structured. I particularly enjoyed the hands-on exercises.",
            "Not bad, but I expected more depth on certain topics.",
            "Outstanding quality. One of the best courses I've taken.",
            "Solid course for beginners. More advanced students might find it too basic.",
            "The material is good but the pacing could be better.",
            "Highly recommend! Worth every penny.",
            "Informative and engaging throughout.",
            "A bit too theoretical for my taste, but still useful.",
        };

        var reviewBatch = new List<Review>();
        foreach (var enrollment in allEnrollments)
        {
            if (rng.NextDouble() > ReviewProbability) continue;

            //biased
            var grade = rng.NextDouble() switch
            {
                < 0.05 => 1,
                < 0.10 => 2,
                < 0.25 => 3,
                < 0.55 => 4,
                _ => 5,
            };

            var reviewedAt = RandomDateBetween(rng, enrollment.EnrolledAt, enrollTo);
            reviewBatch.Add(new Review
            {
                EnrollmentId = enrollment.Id,
                Grade = grade,
                Comment = reviewComments[rng.Next(reviewComments.Length)],
                CreatedAt = reviewedAt,
            });

            if (reviewBatch.Count >= chunkSize)
            {
                db.Reviews.AddRange(reviewBatch);
                await db.SaveChangesAsync();
                Console.Write($"\r  inserting reviews... {reviewBatch.Count} so far");
                reviewBatch.Clear();
            }
        }

        db.Reviews.AddRange(reviewBatch);
        await db.SaveChangesAsync();

        var totalReviews = await db.Reviews.CountAsync();
        Console.WriteLine();
        Console.WriteLine($"  + {totalReviews} reviews (~{(int)(ReviewProbability * 100)}% of {allEnrollments.Count} enrollments)");


        // teacher payouts


        Console.WriteLine("Generating teacher payouts...");
        var payoutStatuses = new[] { PayoutStatus.Pending, PayoutStatus.Approved, PayoutStatus.Paid, PayoutStatus.Rejected };
        var balances = await db.TeacherProfiles.ToDictionaryAsync(tp => tp.UserId, tp => tp.Balance);
        var payoutBatch = new List<Payout>();
        foreach (var teacher in teachers)
        {
            var earnings = balances.GetValueOrDefault(teacher.Id, 0m);
            if (earnings <= 0) continue;
            var remaining = earnings;
            var payoutCount = rng.Next(0, 4); // each teacher requests 0-3 payouts
            for (var i = 0; i < payoutCount && remaining > 10m; i++)
            {
                var maxAmount = Math.Min(remaining * 0.6m, 200m);
                var amount = Math.Round(Math.Max(10m, (decimal)rng.NextDouble() * maxAmount), 2);
                var status = payoutStatuses[rng.Next(payoutStatuses.Length)];
                var requestedAt = RandomDateBetween(rng, enrollTo.AddMonths(-6), enrollTo);
                payoutBatch.Add(new Payout
                {
                    TeacherId = teacher.Id,
                    Amount = amount,
                    Status = status,
                    RequestedAt = requestedAt,
                });
                if (status != PayoutStatus.Rejected)
                    remaining -= amount;
            }
        }
        db.Payouts.AddRange(payoutBatch);
        await db.SaveChangesAsync();
        Console.WriteLine($"  + {payoutBatch.Count} teacher payouts");

        Console.WriteLine();
        Console.WriteLine("Done.");
        Console.WriteLine($"  Total records inserted (approx): " +
                          $"{categories.Count + teachers.Count + students.Count + courses.Count + totalLessons + taken.Count + totalProgress + totalReviews + payoutBatch.Count}");
    }

    // helpers functions

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


    // CSV row mapping 
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
