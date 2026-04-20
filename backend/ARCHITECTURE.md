# Backend — How Everything Works

This document explains the backend codebase at the implementation level. It's written for someone who wants to genuinely understand how things work, not just what files exist.

---

## Table of Contents

1. [C# Patterns You'll See Everywhere](#1-c-patterns-youll-see-everywhere)
2. [How ASP.NET Core Processes a Request](#2-how-aspnet-core-processes-a-request)
3. [Program.cs — The Composition Root](#3-programcs--the-composition-root)
4. [Entity Framework Core — The ORM](#4-entity-framework-core--the-orm)
5. [Authentication — How Login/Logout Works](#5-authentication--how-loginlogout-works)
6. [Controllers — What Each One Does](#6-controllers--what-each-one-does)
7. [Database Triggers — How They Interact With the App](#7-database-triggers--how-they-interact-with-the-app)
8. [The Recommendation Procedure](#8-the-recommendation-procedure)
9. [Common Patterns and Conventions](#9-common-patterns-and-conventions)

---

## 1. C# Patterns You'll See Everywhere

### Records

```csharp
public record UserResponse(int Id, string Email, string FirstName, string LastName, string Role);
```

A `record` is like a class but designed for data. The compiler auto-generates:
- A constructor with all the listed parameters
- Read-only properties for each parameter
- `Equals()` and `GetHashCode()` based on all properties (value equality, not reference equality)
- A `ToString()` that prints all fields

We use records for all **DTOs** (Data Transfer Objects) — the shapes we send to/from the frontend. They're immutable and serialize to JSON automatically.

**Request DTOs** (the ones sent FROM the frontend) carry **validation attributes** — `[Required]`, `[MinLength]`, `[MaxLength]`, `[Range]`, `[EmailAddress]`, etc. Because every controller is decorated with `[ApiController]`, ASP.NET validates these automatically before the controller method runs. If validation fails, the framework returns a 400 response with field-level error messages — no manual checking needed in the controller.

### Primary Constructors

```csharp
public class CoursesController(AppDbContext db) : ControllerBase
```

This is C# 12 syntax. The `(AppDbContext db)` is a **primary constructor** — it means "when ASP.NET creates this controller, inject an `AppDbContext` and make it available as `db` throughout the class." It's equivalent to:

```csharp
public class CoursesController : ControllerBase
{
    private readonly AppDbContext db;
    public CoursesController(AppDbContext db) { this.db = db; }
}
```

Every controller uses this pattern to get its dependencies injected.

### Dependency Injection (DI)

In `Program.cs`, we register services:

```csharp
builder.Services.AddDbContext<AppDbContext>(...);
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
```

Then controllers declare what they need via their constructor. ASP.NET automatically creates and passes the right objects. You never write `new AppDbContext()` yourself — the framework manages the lifecycle.

- `AddDbContext` → one instance per HTTP request (disposed after the request ends)
- `AddSingleton` → one instance for the entire application lifetime
- `AddScoped` → one per request (same as DbContext)
- `AddTransient` → new instance every time it's requested

### async/await

```csharp
public async Task<ActionResult<UserResponse>> Login(LoginRequest req)
{
    var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
    ...
}
```

Database queries are I/O operations — they go to postgres and wait for a response. `async/await` means "start this query, and while we're waiting for postgres to respond, the thread is free to handle other HTTP requests." Without async, the thread would sit idle waiting.

Every method that touches the database is `async` and returns `Task<T>`. The `await` keyword pauses the method until the result arrives.

### Nullable Reference Types

```csharp
public string? CourseTitle { get; set; }  // can be null
public string Email { get; set; } = string.Empty;  // never null
```

The `?` suffix means "this can be null." Without `?`, the compiler warns if you might assign null. The `= string.Empty` provides a default so the property is never null even before it's set.

### Pattern Matching

```csharp
projected = filters.Sort switch
{
    "oldest" => projected.OrderBy(p => p.Course.CreatedAt),
    "price_asc" => projected.OrderBy(p => p.Course.Price),
    _ => projected.OrderByDescending(p => p.Course.CreatedAt), // default
};
```

`switch` expressions match a value against patterns. The `_` is the default (catch-all). This replaces verbose if-else chains for mapping values.

---

## 2. How ASP.NET Core Processes a Request

When the frontend calls `fetch('http://localhost:5000/api/courses/42')`, here's what happens:

```
Browser → HTTP request → Kestrel (web server)
    → CORS middleware (checks origin)
    → Authentication middleware (reads lp.auth cookie → builds ClaimsPrincipal)
    → Authorization middleware (checks [Authorize] attributes)
    → Routing (matches URL to controller method)
    → Model binding (parses query/body into C# objects)
    → Controller method runs
    → Returns ActionResult → serialized to JSON
    → HTTP response → Browser
```

Each step in this chain is a **middleware**. They're registered in order in `Program.cs`:

```csharp
app.UseCors();           // 1st: check if origin is allowed
app.UseAuthentication(); // 2nd: read cookie, build user identity
app.UseAuthorization();  // 3rd: check if user has required role
app.MapControllers();    // 4th: route to the right controller
```

**Order matters.** Authentication must happen before authorization (you need to know *who* before checking *what they can do*). CORS must happen first (a rejected origin should get a fast response without running auth).

---

## 3. Program.cs — The Composition Root

`Program.cs` is where everything is configured. It runs once when the app starts. Let me walk through each section:

### Database registration

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("Default"))
        .UseSnakeCaseNamingConvention());
```

This tells EF Core: "use PostgreSQL, connect with this connection string, and convert all C# PascalCase names to snake_case for table/column names." So `FirstName` in C# becomes `first_name` in postgres.

The connection string comes from `appsettings.Development.json`:
```json
"ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=learningplatform;Username=bodia"
}
```

### Password hasher

```csharp
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
```

This is the ONLY thing we use from ASP.NET Identity. `PasswordHasher<User>` is a standalone class that hashes passwords using bcrypt (actually PBKDF2 by default). We deliberately did NOT use the full Identity framework because it would add 7 tables and ~13 columns.

### Cookie authentication

```csharp
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => { ... });
```

This configures cookie-based auth. The key settings:

- `Cookie.Name = "lp.auth"` — the cookie name browsers will store
- `HttpOnly = true` — JavaScript can't read the cookie (XSS protection)
- `SameSite = Lax` — cookie is sent on same-site requests + top-level navigations (CSRF protection)
- `ExpireTimeSpan = 7 days` — cookie expires after 7 days
- `SlidingExpiration = true` — each request resets the 7-day timer

The two event overrides are critical:

```csharp
options.Events.OnRedirectToLogin = ctx =>
{
    ctx.Response.StatusCode = 401;
    return Task.CompletedTask;
};
```

By default, ASP.NET's cookie auth *redirects* unauthenticated users to `/Account/Login` (for MVC apps). We override this to return 401 instead, because we're an API — the frontend handles the redirect.

### CORS

```csharp
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));
```

CORS (Cross-Origin Resource Sharing) controls which domains can call our API. The frontend runs on `:5173`, the API on `:5000` — different origins. Without CORS, the browser blocks the requests.

`AllowCredentials()` is required because we use cookies. Without it, the browser won't send the `lp.auth` cookie to a different origin.

### Auto-migration and seeding

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await DbSeeder.SeedAsync(scope.ServiceProvider);
}
```

On every startup, the app:
1. Creates a temporary DI scope (to get a fresh DbContext)
2. Applies any pending EF migrations (`Migrate()`)
3. Runs `DbSeeder.SeedAsync()` which only ensures the admin user exists

This is why you don't need to run `dotnet ef database update` manually — the app does it for you.

---

## 4. Entity Framework Core — The ORM

### What EF Core does

EF Core translates C# code into SQL. When you write:

```csharp
var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
```

EF Core generates:
```sql
SELECT * FROM users WHERE email = @p0 LIMIT 2
```

(It uses `LIMIT 2` because `SingleOrDefault` means "there should be exactly 0 or 1 — if there are 2+, throw an error.")

### DbContext and DbSet

`AppDbContext` is our single database context. It has a `DbSet<T>` for each table:

```csharp
public DbSet<User> Users => Set<User>();
public DbSet<Course> Courses => Set<Course>();
// etc.
```

A `DbSet<T>` represents a table. You query it with LINQ:

```csharp
db.Users                              // SELECT * FROM users
    .Where(u => u.Role == "Student")  // WHERE role = 'Student'
    .OrderBy(u => u.LastName)         // ORDER BY last_name
    .Take(20)                         // LIMIT 20
    .ToListAsync();                   // execute the query
```

**Important:** nothing hits the database until you call `.ToListAsync()`, `.SingleOrDefaultAsync()`, `.CountAsync()`, etc. Before that, you're just building a query expression tree. EF translates the whole tree to SQL at the end.

### OnModelCreating — Schema configuration

All table/column configuration lives in `AppDbContext.OnModelCreating()`:

```csharp
b.Entity<User>(e =>
{
    e.HasIndex(u => u.Email).IsUnique();        // CREATE UNIQUE INDEX ...
    e.Property(u => u.FirstName).IsRequired().HasMaxLength(100);  // NOT NULL, VARCHAR(100)
    e.Property(u => u.Role).IsRequired().HasMaxLength(20);
    e.ToTable(t => t.HasCheckConstraint("ck_users_role",
        "role IN ('Admin','Teacher','Student')"));  // CHECK constraint
});
```

We use the **Fluent API** (method chaining) for **entity** configuration (the database schema). Data annotations like `[Required]` and `[MaxLength]` are used on **request DTOs** for input validation (see the Records section above), but entity classes stay clean — just plain data holders with all DB-specific configuration in one place.

### Navigation properties and Include

Models have navigation properties that represent relationships:

```csharp
public class Course
{
    public int AuthorId { get; set; }          // FK column
    public TeacherProfile? Author { get; set; } // navigation property
    public List<Lesson> Lessons { get; set; } = [];
    public List<Category> Categories { get; set; } = [];
}
```

By default, EF does NOT load related data. `course.Author` would be `null` even if `course.AuthorId` is set. To load related data:

```csharp
var course = await db.Courses
    .Include(c => c.Author!)              // JOIN teacher_profiles
    .ThenInclude(a => a.User)             // JOIN users (for the teacher's name)
    .Include(c => c.Categories)           // JOIN course_categories + categories
    .Include(c => c.Lessons.OrderBy(l => l.OrderNumber))  // JOIN lessons, sorted
    .SingleOrDefaultAsync(c => c.Id == id);
```

Each `.Include()` adds a JOIN to the SQL. `.ThenInclude()` chains a second JOIN off the first.

### Migrations

When you change the model (e.g., add a column), EF generates a migration:

```bash
dotnet ef migrations add AddStatusColumn
```

This creates a C# file in `Migrations/` that contains the SQL to alter the table. On next app startup (or `dotnet ef database update`), the migration is applied. EF tracks which migrations have been applied in a `__EFMigrationsHistory` table.

For raw SQL (triggers, functions), we write `migrationBuilder.Sql(...)` inside the migration's `Up()` method.

### Change tracking and SaveChanges

EF tracks changes to objects:

```csharp
var user = await db.Users.FindAsync(id);  // EF now tracks this user
user.Status = "Suspended";                 // EF detects this change
await db.SaveChangesAsync();               // generates: UPDATE users SET status = 'Suspended' WHERE id = @p0
```

For new objects:
```csharp
db.Users.Add(newUser);         // mark as "to be inserted"
await db.SaveChangesAsync();   // generates: INSERT INTO users (...) VALUES (...)
// newUser.Id is now populated (postgres returned the auto-generated id)
```

`SaveChangesAsync()` wraps all pending changes in a single database transaction. If any INSERT/UPDATE fails, they all roll back.

---

## 5. Authentication — How Login/Logout Works

### Login flow (AuthController.Login)

```
1. Frontend sends POST /api/auth/login { email, password }

2. Controller looks up user:
   var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);

3. Checks suspension:
   if (user.Status == "Suspended") return 401;

4. Verifies password:
   var result = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
   // PasswordHasher extracts the salt from the stored hash,
   // re-hashes the provided password with that salt,
   // and compares. Never stores or compares plain text.

5. Builds claims (pieces of identity info):
   var claims = new List<Claim>
   {
       new(ClaimTypes.NameIdentifier, user.Id.ToString()),  // "who am I" = user id
       new(ClaimTypes.Email, user.Email),
       new(ClaimTypes.Role, user.Role),                     // "what can I do" = role
   };

6. Signs in (creates the cookie):
   var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
   await HttpContext.SignInAsync(..., new ClaimsPrincipal(identity), ...);
   // This serializes the claims, encrypts them, and writes the lp.auth cookie.

7. Returns user info:
   return new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, user.Role);
```

### How subsequent requests are authenticated

Every request after login:
1. Browser automatically sends the `lp.auth` cookie
2. ASP.NET's cookie middleware decrypts it → extracts the claims
3. Builds a `ClaimsPrincipal` and attaches it to `HttpContext.User`
4. `[Authorize]` checks if the principal exists (is the user logged in?)
5. `[Authorize(Roles = "Student")]` checks if the role claim matches

### How controllers read the current user

```csharp
private int CurrentUserId =>
    int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
```

`User` here is the controller's `ClaimsPrincipal` property (inherited from `ControllerBase`). `FindFirstValue(ClaimTypes.NameIdentifier)` extracts the user id from the claims that were put into the cookie during login.

---

## 6. Controllers — What Each One Does

### General pattern

Every controller follows the same structure:

```csharp
[ApiController]                          // enables automatic model validation
[Route("api/courses")]                   // base URL prefix
[Authorize]                              // requires authentication
public class CoursesController(AppDbContext db) : ControllerBase
{
    [HttpGet]                            // GET /api/courses
    public async Task<ActionResult<T>> List(...) { ... }

    [HttpGet("{id:int}")]                // GET /api/courses/42
    public async Task<ActionResult<T>> Get(int id) { ... }
}
```

- `[ApiController]` enables automatic model validation — if a request DTO has validation attributes (`[Required]`, `[MaxLength]`, `[Range]`, etc.) and the incoming JSON violates them, ASP.NET returns 400 with field-level errors before the controller method even runs
- `[Route]` sets the URL prefix
- `[Authorize]` / `[Authorize(Roles = "...")]` controls access
- Each method is an endpoint, decorated with `[HttpGet]`, `[HttpPost]`, etc.
- Return type `ActionResult<T>` means "either a T (200) or an error response (400/401/404)"

### AuthController — register, login, logout

**POST /api/auth/register** — creates a new user. Validates that the role is Student or Teacher (admin can't be self-registered). Hashes the password. If Teacher, also creates a `TeacherProfile` row. Signs in immediately after creation (sets the cookie).

**POST /api/auth/login** — finds user by email, checks suspension status, verifies password hash, sets cookie. Returns user info.

**POST /api/auth/logout** — calls `HttpContext.SignOutAsync()` which clears the cookie.

### MeController — current user info

**GET /api/me** — reads the user id from the cookie claims, looks up the user in the DB. If the user has been suspended since they logged in, it signs them out and returns 401. Otherwise returns the user info. This endpoint is called by the frontend on every page load (in `AuthProvider`).

### CoursesController — student-facing catalog

**GET /api/courses** — the most complex query in the app. Let me walk through it:

```csharp
// 1. Start with published courses only
var query = db.Courses.Where(c => c.Status == "Published");

// 2. Apply each filter (only if the parameter was provided)
if (!string.IsNullOrWhiteSpace(q))
    query = query.Where(c => EF.Functions.ILike(c.Title, $"%{q}%"));
    // ILike = case-insensitive LIKE in postgres

if (categoryIds is { Length: > 0 })
    query = query.Where(c => c.Categories.Any(cat => categoryIds.Contains(cat.Id)));
    // "course has at least one category whose id is in the provided list"
    // EF translates this to: EXISTS (SELECT 1 FROM course_categories WHERE ...)

// 3. Project to include computed fields (rating, counts)
var projected = query.Select(c => new
{
    Course = c,
    AverageRating = db.Reviews
        .Where(r => r.Enrollment!.CourseId == c.Id)
        .Select(r => (double?)r.Grade).Average() ?? 0d,
    // This becomes a correlated subquery in SQL:
    // (SELECT AVG(grade) FROM reviews JOIN enrollments ON ... WHERE course_id = c.id)
});

// 4. Sort
projected = sort switch
{
    "price_asc" => projected.OrderBy(p => p.Course.Price),
    _ => projected.OrderByDescending(p => p.Course.CreatedAt),
};

// 5. Count total (for pagination) THEN take one page
var totalCount = await projected.CountAsync();  // SELECT COUNT(*) ...
var rows = await projected.Skip((page-1) * pageSize).Take(pageSize)
    .Select(p => new CourseListItemDto(...))
    .ToListAsync();

return new PagedResult<CourseListItemDto>(rows, totalCount, page, pageSize);
```

The key insight: EF translates this entire chain into ONE SQL query. The `Select`, `Where`, `OrderBy`, `Skip`, `Take` — all become parts of the same `SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ... OFFSET ...` statement.

**GET /api/courses/{id}** — loads a single **published** course with all its relations (`Include` for author, categories, lessons) plus runs separate queries for reviews and enrollment count. The query includes `c.Status == CourseStatus.Published`, so unpublished courses return 404 to students.

### EnrollmentsController — student enrollment + progress + reviews + recommendations

**POST /api/courses/{id}/enroll** — the enrollment flow:
```
1. Find the course (must be Published)
2. Check student isn't already enrolled (unique constraint would catch this anyway,
   but a friendly error message is better than a 500)
3. Begin a transaction
4. Create a Payment row (status = Completed, amount = course price)
5. Create an Enrollment row
6. SaveChanges (both are INSERTed in the same transaction)
7. Commit
8. The payment INSERT fires trigger trg_payments_balance, which recomputes
   the teacher's balance automatically
9. Return { enrollmentId, firstLessonId }
```

**POST /api/enrollments/{id}/lessons/{lessonId}/complete** — inserts a `lesson_progress` row. The trigger `trg_lesson_progress_recompute` fires and updates `enrollments.progress`.

**DELETE /api/enrollments/{id}/lessons/{lessonId}/complete** — removes the `lesson_progress` row. Same trigger fires and decrements progress.

**GET /api/me/recommendations** — calls the SQL function:
```csharp
var rawResults = await db.Database
    .SqlQuery<RawRecommendation>($"SELECT * FROM get_recommendations({studentId}, 6)")
    .ToListAsync();
```

`SqlQuery<T>` maps each column of the SQL result to properties of `RawRecommendation` by name. The `$"..."` is an interpolated string that becomes a parameterized query (safe from SQL injection).

### TeacherCoursesController — course and lesson CRUD

**Lesson reorder** is the most interesting operation:

```csharp
// The unique constraint on (course_id, order_number) means we can't
// just swap two lessons — UPDATE lesson SET order=2 WHERE order=1
// would temporarily create a duplicate (1→2 while 2 still exists).
//
// Solution: two-pass update within a transaction.
// Pass 1: set all order numbers to negative values (no conflicts possible)
// Pass 2: set them to the desired final values

await using var tx = await db.Database.BeginTransactionAsync();

// Pass 1: all negative
var temp = -1;
foreach (var l in course.Lessons) l.OrderNumber = temp--;
await db.SaveChangesAsync();

// Pass 2: real order from the request
for (var i = 0; i < req.LessonIds.Length; i++)
    lessonsById[req.LessonIds[i]].OrderNumber = i + 1;
await db.SaveChangesAsync();

await tx.CommitAsync();
```

**Lesson deletion** also compacts the order numbers:
```
Before: Lesson A (order=1), Lesson B (order=2), Lesson C (order=3)
Delete B: Lesson A (order=1), Lesson C (order=3)
Compact:  Lesson A (order=1), Lesson C (order=2)
```

### TeacherAnalyticsController — analytics and timeline

**GET /api/teacher/courses/{id}/analytics** — runs multiple queries:
- Count enrollments
- Sum completed payments (revenue)
- Average review grade
- Completion rate = count(progress >= 100) / count(all enrollments)
- Top 10 recent students

**GET /api/teacher/courses/{id}/enrollments-timeline** — groups enrollments by date:
```csharp
var rows = await db.Enrollments
    .Where(e => e.CourseId == id && e.EnrolledAt >= fromDate && e.EnrolledAt < toExclusive)
    .GroupBy(e => e.EnrolledAt.Date)    // GROUP BY date(enrolled_at)
    .Select(g => new { Date = g.Key, Count = g.Count() })
    .ToListAsync();
```

Then fills in missing days with zeros so the chart has continuous data.

### AdminFinanceController — dashboard + payments + refund

**POST /api/admin/payments/{id}/refund** — the refund flow:
```
1. Find the payment
2. Begin transaction
3. Flip payment status to "Refunded"
   → trigger trg_payments_balance fires → teacher's balance decreases
4. Find the matching enrollment (same student + course)
5. Delete it
   → cascade deletes lesson_progress rows
   → cascade deletes the review (if any)
6. Commit
```

Student loses access to the course, their progress, and their review — all in one atomic transaction.

### AdminPayoutsController — payout state machine

The payout lifecycle: `Pending → Approved → Paid` or `Pending → Rejected`.

Each transition is a simple method:
```csharp
private async Task<IActionResult> Transition(int id, string fromStatus, string toStatus)
{
    var payout = await db.Payouts.FindAsync(id);
    if (payout.Status != fromStatus)
        return BadRequest(new { error = $"Payout is not in '{fromStatus}' state." });
    payout.Status = toStatus;
    await db.SaveChangesAsync();
    // trg_payouts_balance fires automatically
    return NoContent();
}
```

The trigger handles the balance:
- Approve: balance unchanged (still "locked")
- Mark Paid: balance unchanged (still deducted)
- Reject: balance increases (the deduction is released because rejected payouts are excluded from the formula)

### AdminUsersController — suspend/activate

```csharp
if (id == CurrentUserId)
    return BadRequest("You cannot change your own status.");
if (user.Role == Roles.Admin)
    return BadRequest("Admin accounts cannot be suspended.");

user.Status = req.Status;
await db.SaveChangesAsync();
```

Two safety checks: can't suspend yourself (would lock you out), can't suspend other admins (prevents admin wars).

---

## 7. Database Triggers — How They Interact With the App

### Key concept

Triggers run **inside the database**, not in the C# application. When C# code calls `db.SaveChangesAsync()`, EF sends the SQL statements to postgres. Postgres executes them AND fires any relevant triggers — all within the same database transaction. The C# code doesn't know the triggers exist; it just sees the final state.

### Trigger 1: Progress recomputation

**When:** a row is INSERTed or DELETEd from `lesson_progress`
**What:** recomputes `enrollments.progress` = (completed lessons × 100) / total lessons

The app code just does:
```csharp
db.LessonProgress.Add(new LessonProgress { EnrollmentId = id, LessonId = lessonId });
await db.SaveChangesAsync();
// After this, enrollments.progress is already updated by the trigger.
// But the C# object in memory is NOT updated (EF doesn't re-read after trigger).
// The frontend re-fetches the enrollment data via a separate GET request.
```

### Triggers 2 & 3: Balance recomputation

**When:** a `payments` or `payouts` row is INSERTed or its `status` is UPDATEd
**What:** recomputes `teacher_profiles.balance` from scratch using:
```sql
balance = SUM(completed payments to this teacher's courses)
        - SUM(non-rejected payouts by this teacher)
```

This means the app NEVER sets `balance` directly. It just inserts/updates payments and payouts, and the trigger keeps balance in sync. The benefit: no matter how the data is modified (via the app, via psql, via the data loader), the balance is always correct.

### Important caveat: EF change tracking vs triggers

When a trigger modifies a row that EF is tracking, EF's in-memory copy is **stale** — it doesn't know the trigger changed something. This doesn't cause bugs in our app because:
1. We never read the trigger-modified value in the same request
2. The frontend always re-fetches data after mutations (via TanStack Query invalidation)

But if you ever needed to read the updated balance immediately after an enrollment, you'd need to call `await db.Entry(profile).ReloadAsync()` to re-read from the database.

---

## 8. The Recommendation Procedure

The `get_recommendations` function is a PL/pgSQL stored procedure. It's NOT a trigger — it's called explicitly from the C# endpoint via `SqlQuery`.

See `backend/RECOMMENDATIONS.md` for the full theory (support, confidence, lift). Here's how it works at the SQL level:

```sql
-- Step 1: find my courses
WITH my_courses AS (
    SELECT course_id FROM enrollments WHERE student_id = target_student_id
),
-- Step 2: find peers (other students in the same courses) and their other enrollments
peer_enrollments AS (
    SELECT shared_course, recommended_course, peer_id, peer_progress
    FROM enrollments e_mine
    JOIN enrollments e_peer ON same_course
    JOIN enrollments e_other ON same_student_different_course
    WHERE NOT IN my_courses  -- exclude what I already have
),
-- Step 3: compute metrics per rule
rule_metrics AS (
    SELECT recommended_course, shared_course,
           confidence, lift, weighted_peer_count
    ...
),
-- Step 4: combine and score
scored AS (
    SELECT recommended_course,
           SUM(confidence × lift × completion_weight) × rating × category_bonus
    ...
)
SELECT course_id, score, confidence, lift, reason
FROM scored
ORDER BY score DESC LIMIT max_results;
```

The procedure uses **CTEs** (Common Table Expressions — the `WITH ... AS (...)` syntax) to build up the query step by step. Each CTE is like a temporary named table that only exists for this query. Postgres optimizes the whole thing as one execution plan.

---

## 9. Common Patterns and Conventions

### DTO projection

We never return entity objects directly to the frontend. Instead, we **project** to DTOs:

```csharp
.Select(p => new AdminPaymentDto(
    p.Id,
    p.CreatedAt,
    p.StudentId,
    p.Student!.FirstName + " " + p.Student.LastName,
    ...
))
```

Why: (1) entities have navigation properties that could cause circular serialization, (2) we don't want to expose internal fields like `PasswordHash`, (3) DTOs are the contract with the frontend — changing an entity doesn't break the API.

### Ownership checks

Teacher endpoints always verify the resource belongs to the current teacher:

```csharp
var course = await db.Courses
    .SingleOrDefaultAsync(c => c.Id == id && c.AuthorId == teacherId);
if (course is null) return NotFound();
```

If the course doesn't exist OR belongs to someone else, the teacher gets a 404. We don't distinguish "not found" from "not yours" — that would leak information about other teachers' courses.

### Transaction wrapping

Operations that modify multiple tables use explicit transactions:

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
// ... multiple SaveChangesAsync calls ...
await tx.CommitAsync();
```

If any step fails, the `using` block disposes the transaction without committing, which rolls back all changes. Without the explicit transaction, each `SaveChangesAsync` would be its own transaction — leaving the database in a partially-modified state if the second one fails.

### Pagination pattern

All paginated endpoints follow the same structure:

```csharp
page = Math.Max(1, page);                    // clamp to valid range
pageSize = Math.Clamp(pageSize, 1, 100);     // prevent absurd page sizes
var totalCount = await query.CountAsync();     // one COUNT query
var items = await query
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .Select(...)                              // project to DTO
    .ToListAsync();                           // one SELECT query
return new PagedResult<T>(items, totalCount, page, pageSize);
```

Two SQL queries per paginated request: one for the count, one for the page. The frontend needs `totalCount` to render page numbers.

### Npgsql DateTime gotcha

PostgreSQL `timestamp with time zone` columns require `DateTime` values with `Kind = Utc`. ASP.NET's model binder produces `Kind = Unspecified` from query strings. Every endpoint that accepts dates must convert:

```csharp
var toDate = DateTime.SpecifyKind((to ?? DateTime.UtcNow).Date, DateTimeKind.Utc);
```

Without this, Npgsql throws: "Cannot write DateTime with Kind=Unspecified to PostgreSQL type 'timestamp with time zone'".
