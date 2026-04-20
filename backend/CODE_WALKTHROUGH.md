# Backend — Code Walkthrough

Real code snippets from actual files with line-by-line explanations.

---

## File: `Data/AppDbContext.cs`

This is the single database context — the bridge between C# objects and postgres tables.

### Line 6 — Primary constructor inheriting from DbContext

```csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
```

- `DbContext` is EF Core's base class for database access
- `DbContextOptions` carries the connection string + configuration (from `Program.cs`)
- The primary constructor `(... options)` receives these from dependency injection
- `: DbContext(options)` passes them to the parent class

### Lines 8-17 — DbSet declarations

```csharp
public DbSet<User> Users => Set<User>();
public DbSet<Course> Courses => Set<Course>();
```

Each `DbSet<T>` is a "table handle." `db.Users` gives you access to the `users` table. The `=> Set<User>()` syntax is a property that calls the base `Set<T>()` method — it's slightly more memory-efficient than `{ get; set; }` because it doesn't store a backing field.

### Lines 21-35 — User entity configuration

```csharp
b.Entity<User>(e =>
{
    e.HasIndex(u => u.Email).IsUnique();
    e.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
    e.Property(u => u.Role).IsRequired().HasMaxLength(20);
    e.Property(u => u.Status).IsRequired().HasMaxLength(20).HasDefaultValue(UserStatus.Active);
    e.ToTable(t =>
    {
        t.HasCheckConstraint("ck_users_role", "role IN ('Admin','Teacher','Student')");
        t.HasCheckConstraint("ck_users_status", "status IN ('Active','Suspended')");
    });
});
```

- **Line 23:** `HasIndex(...).IsUnique()` → creates `CREATE UNIQUE INDEX ix_users_email ON users (email)`. This means no two users can have the same email — enforced at the database level.
- **Line 24:** `IsRequired()` → `NOT NULL`. `HasMaxLength(100)` → `VARCHAR(100)` in postgres.
- **Line 29:** `HasDefaultValue(UserStatus.Active)` → when EF generates an INSERT and the C# property has its default value, the column is omitted and postgres uses `'Active'`.
- **Lines 32-33:** `HasCheckConstraint` → raw SQL CHECK constraints. These are enforced by postgres itself — even if someone runs a manual `INSERT` via psql, the constraint catches invalid values.

### Lines 37-46 — TeacherProfile: one-to-one relationship

```csharp
e.HasKey(p => p.UserId);                           // PK is the FK itself (no separate id)
e.HasOne(p => p.User)                              // TeacherProfile has one User
    .WithOne(u => u.TeacherProfile)                // User has one TeacherProfile
    .HasForeignKey<TeacherProfile>(p => p.UserId)  // FK is UserId
    .OnDelete(DeleteBehavior.Cascade);             // delete profile when user is deleted
```

The `HasKey(p => p.UserId)` is key — `UserId` is BOTH the primary key AND the foreign key. There's no separate `Id` column. This enforces the one-to-one relationship structurally: there can only be one `teacher_profiles` row per user.

### Lines 62-68 — Course: author FK + many-to-many categories

```csharp
e.HasOne(c => c.Author)
    .WithMany()                                    // TeacherProfile has many courses (no nav property)
    .HasForeignKey(c => c.AuthorId)
    .OnDelete(DeleteBehavior.Restrict);            // can't delete a teacher who has courses
e.HasMany(c => c.Categories)
    .WithMany(cat => cat.Courses)
    .UsingEntity(j => j.ToTable("course_categories"));  // explicit join table name
```

- `OnDelete(DeleteBehavior.Restrict)` means postgres will REJECT a `DELETE FROM teacher_profiles WHERE user_id = X` if any courses reference that teacher. This prevents orphaned courses.
- `.WithMany()` with no argument means the TeacherProfile class doesn't have a `List<Course>` navigation property. The relationship exists in the DB but can only be navigated from Course → Author, not the reverse.
- The many-to-many with categories uses `.UsingEntity(...)` to control the join table name. Without it, EF would auto-generate a name like `CategoryCourse`.

### Lines 88-101 — Enrollment: composite unique + check constraint

```csharp
e.HasIndex(en => new { en.StudentId, en.CourseId }).IsUnique();
e.ToTable(t => t.HasCheckConstraint("ck_enrollments_progress", "progress BETWEEN 0 AND 100"));
```

- The composite unique index on `(student_id, course_id)` prevents a student from enrolling twice in the same course. This is a business rule enforced at the database level.
- The CHECK constraint ensures progress is always 0-100. Even if a trigger has a bug, the database won't accept `progress = 150`.

### Lines 104-106 — LessonProgress: composite primary key

```csharp
e.HasKey(lp => new { lp.EnrollmentId, lp.LessonId });
```

No auto-increment `id` column. The primary key IS the combination of `(enrollment_id, lesson_id)`. This means:
- Each (enrollment, lesson) pair can appear at most once (PK enforces uniqueness)
- The table is a pure junction table — its identity is the relationship it represents
- One less column to store, index, and explain

---

## File: `Controllers/AuthController.cs`

### Lines 13-15 — Controller setup

```csharp
[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, IPasswordHasher<User> hasher) : ControllerBase
```

- No `[Authorize]` here — auth endpoints are public (you need to be able to login without already being logged in)
- Two dependencies injected: the database context and the password hasher

### Lines 20-21 — Role validation

```csharp
if (!Roles.SelfRegisterable.Contains(req.Role))
    return BadRequest(new { error = "Role must be Student or Teacher." });
```

`Roles.SelfRegisterable` is `["Teacher", "Student"]`. This prevents someone from registering as Admin via the API. The Admin is only created by the seeder.

`return BadRequest(new { error = "..." })` returns HTTP 400 with JSON body `{"error":"..."}`. The frontend's `api.ts` reads this and shows the error message.

### Lines 23-25 — Email normalization + uniqueness check

```csharp
var email = req.Email.Trim().ToLowerInvariant();
if (await db.Users.AnyAsync(u => u.Email == email))
    return BadRequest(new { error = "Email is already registered." });
```

`AnyAsync` translates to `SELECT EXISTS(SELECT 1 FROM users WHERE email = @p0)` — it returns true/false without loading any data. More efficient than `SingleOrDefaultAsync` for existence checks.

We normalize to lowercase before storing, so `User@Example.COM` and `user@example.com` are treated as the same email.

### Line 37 — Password hashing

```csharp
user.PasswordHash = hasher.HashPassword(user, req.Password);
```

`HashPassword` generates a random salt, hashes `password + salt` using PBKDF2 (hundreds of thousands of iterations), and returns a single string that contains both the salt and the hash. The plain password is never stored.

### Lines 41-42 — Conditional teacher profile creation

```csharp
if (req.Role == Roles.Teacher)
    db.TeacherProfiles.Add(new TeacherProfile { User = user });
```

Note: `User = user` (not `UserId = user.Id`). At this point, `user.Id` is 0 because the user hasn't been saved to the DB yet. EF Core resolves this: when `SaveChangesAsync()` runs, it inserts the user first (getting the auto-generated id), then uses that id for the teacher profile's FK. This works because both are in the same `SaveChangesAsync` call.

### Lines 53-62 — Login: the three-check pattern

```csharp
var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
if (user is null)
    return Unauthorized(new { error = "Invalid credentials." });

if (user.Status == UserStatus.Suspended)
    return Unauthorized(new { error = "This account has been suspended." });

var result = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
if (result == PasswordVerificationResult.Failed)
    return Unauthorized(new { error = "Invalid credentials." });
```

Three checks in order:
1. Does the user exist? (same error as wrong password — don't reveal which)
2. Is the account suspended? (different error — the user should know why)
3. Is the password correct?

Suspension check is BEFORE password check. Why? If we checked the password first, a suspended user would see "invalid credentials" instead of "suspended" — confusing.

### Lines 64-68 — Rehash on algorithm upgrade

```csharp
if (result == PasswordVerificationResult.SuccessRehashNeeded)
{
    user.PasswordHash = hasher.HashPassword(user, req.Password);
    await db.SaveChangesAsync();
}
```

`SuccessRehashNeeded` means "the password is correct, but it was hashed with an older algorithm version." The hasher transparently upgrades the hash to the latest algorithm on the next successful login. This is how ASP.NET handles password hash algorithm migrations without forcing all users to reset their passwords.

### Lines 81-94 — The SignIn helper

```csharp
private async Task SignIn(User user)
{
    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.Role, user.Role),
    };
    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(identity),
        new AuthenticationProperties { IsPersistent = true });
}
```

**Claims** are key-value pairs that describe the user's identity. They're serialized into the cookie. On subsequent requests, ASP.NET deserializes them back.

- `NameIdentifier` = the user's database id (used by controllers to query "my" data)
- `Role` = used by `[Authorize(Roles = "Student")]` to check access

`IsPersistent = true` means the cookie survives browser restarts (it's stored on disk, not just in memory).

---

## File: `Controllers/EnrollmentsController.cs`

### Line 15 — CurrentUserId property

```csharp
private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
```

This extracts the user id from the cookie claims (set during login). The `!` is a null-forgiving operator — we know this claim exists because `[Authorize]` already verified the cookie is valid.

### Lines 77-93 — My Learning query (the "next lesson" subquery)

```csharp
var rows = await db.Enrollments
    .Where(e => e.StudentId == studentId)
    .OrderByDescending(e => e.EnrolledAt)
    .Select(e => new
    {
        e.Id, e.CourseId,
        CourseTitle = e.Course!.Title,
        e.Progress, e.EnrolledAt,
        NextLessonId = e.Course.Lessons
            .Where(l => !db.LessonProgress.Any(lp => lp.EnrollmentId == e.Id && lp.LessonId == l.Id))
            .OrderBy(l => l.OrderNumber)
            .Select(l => (int?)l.Id)
            .FirstOrDefault(),
    })
    .ToListAsync();
```

The `NextLessonId` computation is the interesting part. For each enrollment, it finds the first lesson (by order number) that does NOT have a corresponding `lesson_progress` row. In SQL:

```sql
(SELECT l.id FROM lessons l
 WHERE l.course_id = e.course_id
   AND NOT EXISTS (SELECT 1 FROM lesson_progress lp
                   WHERE lp.enrollment_id = e.id AND lp.lesson_id = l.id)
 ORDER BY l.order_number LIMIT 1)
```

The `(int?)` cast is important — if all lessons are completed, `FirstOrDefault()` returns `null`. Without the cast, it would return `0` (the default for `int`).

### Lines 145-183 — Enrollment flow (the critical transaction)

```csharp
var course = await db.Courses
    .Include(c => c.Lessons.OrderBy(l => l.OrderNumber))
    .SingleOrDefaultAsync(c => c.Id == courseId && c.Status == CourseStatus.Published);
if (course is null) return NotFound(new { error = "Course not found." });
```

**Line 152:** The `Status == Published` check is in the WHERE clause. If a course is still in Draft, the enrollment will fail with "Course not found" — not a crash.

```csharp
if (await db.Enrollments.AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId))
    return BadRequest(new { error = "Already enrolled." });
```

**Line 155:** This check is technically redundant — the unique constraint on `(student_id, course_id)` would also prevent it. But a friendly error message is better than a database exception with a cryptic constraint violation message.

```csharp
await using var tx = await db.Database.BeginTransactionAsync();

db.Payments.Add(new Payment { ... });
var enrollment = new Enrollment { ... };
db.Enrollments.Add(enrollment);

await db.SaveChangesAsync();
await tx.CommitAsync();
```

**Line 158:** `await using var tx` — the `using` ensures the transaction is disposed if anything goes wrong. If `SaveChangesAsync()` throws (e.g., a constraint violation), the `using` block ends, the transaction is disposed without committing, and all changes are rolled back.

**Line 178:** `SaveChangesAsync()` sends both INSERTs in one round-trip. Postgres executes them within the transaction AND fires the trigger (`trg_payments_balance` on the payment insert). The trigger recomputes the teacher's balance — all within the same transaction.

**Line 181:** `course.Lessons.FirstOrDefault()?.Id` — the `?.` is the null-conditional operator. If the course has no lessons (shouldn't happen for published, but defensive), this returns `null` instead of crashing.

---

## File: `Controllers/CoursesController.cs`

### The catalog query — building a query step by step

The key insight: each `.Where()`, `.OrderBy()`, `.Select()` call doesn't execute anything — it builds an expression tree. Only `.ToListAsync()` at the end sends SQL to postgres.

```csharp
var query = db.Courses.Where(c => c.Status == CourseStatus.Published).AsQueryable();
```

`.AsQueryable()` is technically unnecessary here (it's already an `IQueryable`), but it tells the reader "we're going to chain more things onto this."

```csharp
if (!string.IsNullOrWhiteSpace(q))
{
    var term = $"%{q.Trim()}%";
    query = query.Where(c => EF.Functions.ILike(c.Title, term));
}
```

`EF.Functions.ILike` is a postgres-specific function — case-insensitive LIKE. It translates to `WHERE title ILIKE '%search term%'`. The `$"%{q}%"` wraps the search term in wildcards.

Each `if` block conditionally adds a WHERE clause. If the parameter isn't provided, that filter is skipped. The final SQL only includes the clauses for parameters that were actually sent.

---

## File: `Models/User.cs`

### Lines 3-11 — Static constants as enums

```csharp
public static class Roles
{
    public const string Admin = "Admin";
    public const string Teacher = "Teacher";
    public const string Student = "Student";

    public static readonly string[] All = [Admin, Teacher, Student];
    public static readonly string[] SelfRegisterable = [Teacher, Student];
}
```

We use `const string` instead of C# `enum` because:
1. The database stores text values, not integers. `enum Role { Admin = 0, Teacher = 1 }` would store 0 and 1.
2. Text is human-readable in psql: `SELECT * FROM users WHERE role = 'Student'` vs `WHERE role = 1`.
3. `[Authorize(Roles = "Student")]` requires a string — with an enum you'd need `.ToString()` everywhere.
4. The CHECK constraint `role IN ('Admin','Teacher','Student')` works naturally with text.

`[Admin, Teacher, Student]` is C# 12 collection expression syntax — equivalent to `new[] { Admin, Teacher, Student }`.

### Lines 13-23 — User entity (POCO)

```csharp
public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Student;
    public string Status { get; set; } = UserStatus.Active;
    public TeacherProfile? TeacherProfile { get; set; }
}
```

- `= string.Empty` prevents null reference warnings. EF will overwrite these when loading from the DB.
- `TeacherProfile?` — the `?` marks it nullable. Students don't have a teacher profile, so this is `null` for them. The `?` tells the compiler "I know this can be null, don't warn me."
- `Id` has no `= ...` default because EF auto-generates it (serial/identity in postgres).

---

## File: `Program.cs` — The auto-migration block

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await DbSeeder.SeedAsync(scope.ServiceProvider);
}
```

**Why `CreateScope()`?** The `AppDbContext` is registered as "scoped" (one per HTTP request). But at startup, there's no HTTP request. `CreateScope()` creates a temporary scope that mimics a request, letting us resolve scoped services.

**Why `using`?** The scope (and the DbContext it created) is disposed when the block ends. This closes the database connection. Without `using`, the connection would leak.

`db.Database.Migrate()` is idempotent — it checks the `__EFMigrationsHistory` table and only applies migrations that haven't been run yet. Safe to call on every startup.
