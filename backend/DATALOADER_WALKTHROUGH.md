# Data Loader — Code Walkthrough

The data loader is a separate .NET console application (`backend/src/LearningPlatform.DataLoader/`) that populates the database with realistic data. It references the API project to reuse entity classes and the `AppDbContext`.

---

## Project Structure

```
LearningPlatform.DataLoader/
├── Program.cs          ← Entry point: arg parsing, reset, mode dispatch
├── DevSeeder.cs        ← Small hardcoded fixture (6 courses)
├── FullLoader.cs       ← Full Kaggle dataset loader (~3700 courses)
├── NamePool.cs         ← Random name generation for teachers/students
├── DbContextFactory.cs ← Creates DbContext with hardcoded connection string
└── data/
    └── courses.csv     ← Kaggle "Udemy Courses" dataset (not in git)
```

---

## Program.cs — Entry Point

### Argument Parsing

```csharp
var dev = args.Contains("--dev");
var reset = args.Contains("--reset");
var help = args.Contains("--help") || args.Contains("-h");
```

Simple flag checking — no argument parsing library needed. The `--limit`, `--enroll-from`, and `--enroll-to` flags are parsed with a positional lookahead loop:

```csharp
for (var i = 0; i < args.Length; i++)
{
    if (args[i] == "--limit" && i + 1 < args.Length && int.TryParse(args[i + 1], out var parsed))
        limit = parsed;
    // ... same for --enroll-from, --enroll-to
}
```

### Startup Sequence

1. **Apply migrations** — `db.Database.MigrateAsync()` ensures the schema is up to date. This means you never need to run the API first.
2. **Check existing data** — looks for courses or non-admin users. If found and `--reset` wasn't passed, prompts the user.
3. **Reset if needed** — deletes all data in dependency order (FK-safe), preserving only the admin account.
4. **Ensure admin** — creates `admin@local / admin123` if it doesn't exist.
5. **Dispatch** — runs either `DevSeeder.RunAsync()` or `FullLoader.RunAsync()`.

### Reset Logic

```csharp
await db.Database.ExecuteSqlRawAsync("DELETE FROM lesson_progress");
await db.Database.ExecuteSqlRawAsync("DELETE FROM reviews");
await db.Database.ExecuteSqlRawAsync("DELETE FROM enrollments");
// ... continues in FK-dependency order ...
await db.Database.ExecuteSqlRawAsync($"DELETE FROM users WHERE role <> '{Roles.Admin}'");
```

Uses raw SQL `DELETE` (not EF `RemoveRange`) for speed — bulk-deleting 50k rows via EF would be extremely slow. The order matters: child tables first, parent tables last, to avoid FK violations.

---

## DevSeeder.cs — Small Fixture

Creates a minimal, predictable dataset for development:

- 5 categories (Programming, JavaScript, Web Development, Data Science, Design)
- 2 teachers (sarah@local, john@local) with `TeacherProfile` records
- 1 student (alice@local)
- 6 courses (3 per teacher), all Published, 4 lessons each
- 1 enrollment (Alice → "React for Beginners") + matching payment
- 1 review (5 stars from Alice)

Everything is hardcoded — no randomness. This means `--dev` always produces the exact same database state, which is ideal for testing specific scenarios.

### How courses are created

```csharp
Course MakeCourse(int authorId, string title, decimal price, string level, params string[] cats) =>
    new()
    {
        AuthorId = authorId,
        Title = title,
        Price = price,
        Level = level,
        Status = CourseStatus.Published,
        Categories = categories.Where(c => cats.Contains(c.Name)).ToList(),
    };
```

The `params string[] cats` pattern lets each course specify its categories as trailing arguments: `MakeCourse(sarah.Id, "React for Beginners", 49.99m, CourseLevel.Beginner, "JavaScript", "Web Development")`.

### Passwords

```csharp
var u = new User { Email = email, FirstName = first, LastName = last, Role = role };
u.PasswordHash = hasher.HashPassword(u, "password123");
```

Uses the same `PasswordHasher<User>` as the auth controller, so login works immediately after seeding.

---

## FullLoader.cs — Kaggle Dataset

This is the main loader. It reads a real Kaggle CSV of Udemy courses and generates surrounding data (teachers, students, enrollments) to create a realistic dataset for the recommendation algorithm.

### Constants

```csharp
private const int CoursesPerTeacher = 6;        // target avg courses per teacher
private const int StudentsPerCourse = 5;         // target avg enrollments per course
private const int MaxLessonsPerCourse = 8;       // cap from CSV's num_lectures
private const double ReviewProbability = 0.8;    // 80% of enrollments get a review
```

These control the shape of the generated data. Adjusting them changes the density of the dataset.

### Deterministic Randomness

```csharp
var rng = new Random(42);  // fixed seed
```

Every random decision uses this single `Random` instance with a fixed seed. This makes the loader **deterministic** — running it twice on the same CSV produces identical data. Useful for debugging and reproducibility.

### Step-by-Step Data Generation

#### Step 1: Categories (REAL)

```csharp
var subjectNames = rows.Select(r => r.Subject).Distinct().ToList();
```

Categories come directly from the CSV's `subject` column. The Kaggle dataset has 4 subjects: Business Finance, Graphic Design, Musical Instruments, Web Development.

#### Step 2: Teachers (GENERATED)

```csharp
var teacherCount = Math.Max(50, rows.Count / CoursesPerTeacher);
```

Teacher count is derived from course count. With ~3700 courses and 6 courses/teacher, that's ~600 teachers. But we cap at a minimum of 50 so small `--limit` runs still have variety.

Each teacher specializes in one category:
```csharp
teacherCategories.Add(categories[i % categories.Count].Id);
```

This round-robin assignment ensures even distribution. Later, when assigning courses to teachers, 90% go to a teacher who specializes in that course's category.

#### Step 3: Courses (REAL titles/prices, assigned to teachers)

Course data comes from the CSV — title, price, level, publication date. The loader:
- Filters out non-ASCII titles (they render as tofu in the UI)
- Maps CSV levels ("Beginner Level" → "Beginner", "Expert Level" → "Advanced")
- Assigns each course to a category-matching teacher (90%) or random teacher (10%)
- Inserts in batches of 500 for performance

```csharp
if (category is not null && rng.NextDouble() > 0.1
    && teachersByCategory.TryGetValue(category.Id, out var catTeachers))
{
    teacherIdx = catTeachers[rng.Next(catTeachers.Count)];
}
```

The 10% random assignment simulates teachers who branch out — e.g., a Web Development teacher who also publishes a Design course. This creates cross-category patterns for the recommendation algorithm.

#### Step 4: Lessons (HYBRID — count from CSV, content generated)

```csharp
var count = Math.Clamp(rawCount, 1, MaxLessonsPerCourse);
```

The CSV's `num_lectures` field tells us how many lessons the real course had. We cap at 8 to keep the database manageable. Content is lorem ipsum — we don't have real lesson text.

#### Step 5: Students (GENERATED with category preferences)

```csharp
var prefCount = rng.Next(1, 3);  // 1 or 2 preferred categories
```

Each student gets 1-2 preferred categories. This is **critical** for the recommendation algorithm — without it, enrollments would be random and there would be no patterns to discover.

#### Step 6: Enrollments (CATEGORY-BIASED)

This is the most complex step. Each enrollment is generated by:

1. Pick a random student
2. Decide: 70% chance → pick a course from the student's preferred category; 30% chance → pick any course weighted by popularity
3. Check for duplicates (a student can't enroll twice in the same course)
4. Generate a random enrollment date between the course's publication date and today

```csharp
if (rng.NextDouble() < 0.7 && prefs.Count > 0)
{
    // Biased: pick from preferred category
    var prefCatId = prefs.ElementAt(rng.Next(prefs.Count));
    courseIdx = catCourses[rng.Next(catCourses.Count)];
}
else
{
    // Random: weighted by num_subscribers (popularity)
    var roll = (long)(rng.NextDouble() * totalSubs);
    courseIdx = BinarySearchUpper(cum, roll);
}
```

The **popularity-weighted random** uses a cumulative sum array and binary search — a standard technique for weighted sampling. Courses with more real subscribers on Udemy are more likely to be picked in the 30% random pool.

The 70/30 split creates two types of patterns:
- **Category affinity** — students in "Web Development" tend to take other "Web Development" courses (discoverable by the recommendation algorithm's category signal)
- **Cross-category discovery** — the 30% random enrollments create occasional patterns like "students who took a Finance course also took a Design course" (discoverable by association rules)

#### Step 7: Lesson Progress (RANDOM)

```csharp
var completionRatio = rng.NextDouble() * rng.NextDouble() + rng.NextDouble() * 0.3;
```

This formula produces a **right-skewed distribution** — most students complete a moderate amount (30-60%), few complete everything, few complete nothing. The double multiplication (`NextDouble() * NextDouble()`) biases toward lower values, and the `+ 0.3` shifts the floor up.

The trigger `trg_lesson_progress_recompute` fires on each insert and updates `enrollments.progress` automatically.

#### Step 8: Reviews (80% of enrollments)

```csharp
var grade = rng.NextDouble() switch
{
    < 0.05 => 1,   //  5%
    < 0.10 => 2,   //  5%
    < 0.25 => 3,   // 15%
    < 0.55 => 4,   // 30%
    _ => 5,        // 45%
};
```

Grade distribution is biased toward 4-5 stars (realistic — most online course reviews are positive). Comments are picked randomly from a pool of 12 generic review texts.

#### Step 9: Teacher Payouts (0-3 per teacher)

Random payout requests with random amounts ($10-$210) and random statuses (Pending, Approved, Paid, Rejected). The trigger `trg_payouts_balance` recomputes each teacher's balance automatically.

---

## NamePool.cs — Name Generation

Two arrays of 100+ first names and 100+ last names. `Random()` picks one of each. `EmailFor()` generates an email with a sequence number to avoid collisions:

```csharp
public static string EmailFor(string first, string last, int seq) =>
    $"{first.ToLowerInvariant()}.{last.ToLowerInvariant()}{seq}@local.example";
```

The `seq` parameter starts at 0 and increments if the email is already taken (checked via `usedEmails` HashSet in the loader).

---

## DbContextFactory.cs — Database Connection

```csharp
private const string ConnectionString =
    "Host=localhost;Port=5432;Database=learningplatform;Username=bodia";
```

Hardcoded connection string matching the API's `appsettings.Development.json`. The loader is a local-dev tool that will never run in production, so avoiding config file parsing is a reasonable simplification.

Uses the same `UseSnakeCaseNamingConvention()` as the API to ensure table/column names match.

---

## Why This Design?

**Why a separate project instead of a seed method in the API?**
- The full load takes 10-30 seconds and does bulk inserts. You don't want that in your web server's startup path.
- It needs the Kaggle CSV file, which shouldn't be deployed with the API.
- Different CLI flags for different scenarios — that's a console app's job.

**Why generate data instead of using only the CSV?**
The CSV has courses but no students, enrollments, or reviews. The recommendation algorithm needs enrollment patterns to work. Generating students with category preferences creates discoverable patterns that the association rules can find.

**Why 70/30 category bias?**
Pure random enrollment would produce weak, noisy patterns. Pure category-only enrollment would make the algorithm trivial (just recommend same-category courses). The 70/30 split creates strong but not obvious patterns — exactly what association rules are designed to find.

**Why fixed random seed (42)?**
Reproducibility. If you find a bug in the recommendation algorithm, you can regenerate the exact same dataset and debug it. Without a fixed seed, every run produces different data, making bugs non-reproducible.

**Why batch inserts (chunks of 500)?**
EF Core's change tracker slows down significantly with thousands of tracked entities. Batching + `SaveChangesAsync()` + implicit change tracker reset keeps memory and performance reasonable for 50k+ inserts.
