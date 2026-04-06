using LearningPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<TeacherProfile> TeacherProfiles => Set<TeacherProfile>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<LessonProgress> LessonProgress => Set<LessonProgress>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Payout> Payouts => Set<Payout>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
            e.Property(u => u.LastName).IsRequired().HasMaxLength(100);
            e.Property(u => u.Email).IsRequired().HasMaxLength(255);
            e.Property(u => u.PasswordHash).IsRequired();
            e.Property(u => u.Role).IsRequired().HasMaxLength(20);
            e.ToTable(t => t.HasCheckConstraint("ck_users_role", "role IN ('Admin','Teacher','Student')"));
        });

        b.Entity<TeacherProfile>(e =>
        {
            e.HasKey(p => p.UserId);
            e.Property(p => p.Bio).HasMaxLength(2000);
            e.Property(p => p.Balance).HasColumnType("numeric(10,2)").HasDefaultValue(0m);
            e.HasOne(p => p.User)
                .WithOne(u => u.TeacherProfile)
                .HasForeignKey<TeacherProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Category>(e =>
        {
            e.HasIndex(c => c.Name).IsUnique();
            e.Property(c => c.Name).IsRequired().HasMaxLength(60);
        });

        b.Entity<Course>(e =>
        {
            e.Property(c => c.Title).IsRequired().HasMaxLength(200);
            e.Property(c => c.Description).IsRequired();
            e.Property(c => c.Price).HasColumnType("numeric(10,2)");
            e.Property(c => c.Level).IsRequired().HasMaxLength(20);
            e.Property(c => c.Status).IsRequired().HasMaxLength(20);
            e.Property(c => c.CreatedAt).HasDefaultValueSql("now()");
            e.HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasMany(c => c.Categories)
                .WithMany(cat => cat.Courses)
                .UsingEntity(j => j.ToTable("course_categories"));
            e.ToTable(t =>
            {
                t.HasCheckConstraint("ck_courses_status", "status IN ('Draft','Published')");
                t.HasCheckConstraint("ck_courses_level", "level IN ('Beginner','Intermediate','Advanced')");
                t.HasCheckConstraint("ck_courses_price", "price >= 0");
            });
        });

        b.Entity<Lesson>(e =>
        {
            e.Property(l => l.Title).IsRequired().HasMaxLength(200);
            e.Property(l => l.Content).IsRequired();
            e.HasOne(l => l.Course)
                .WithMany(c => c.Lessons)
                .HasForeignKey(l => l.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(l => new { l.CourseId, l.OrderNumber }).IsUnique();
        });

        b.Entity<Enrollment>(e =>
        {
            e.Property(en => en.EnrolledAt).HasDefaultValueSql("now()");
            e.Property(en => en.Progress).HasDefaultValue(0);
            e.HasOne(en => en.Student)
                .WithMany()
                .HasForeignKey(en => en.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(en => en.Course)
                .WithMany()
                .HasForeignKey(en => en.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(en => new { en.StudentId, en.CourseId }).IsUnique();
            e.ToTable(t => t.HasCheckConstraint("ck_enrollments_progress", "progress BETWEEN 0 AND 100"));
        });

        b.Entity<LessonProgress>(e =>
        {
            e.HasKey(lp => new { lp.EnrollmentId, lp.LessonId });
            e.Property(lp => lp.CompletedAt).HasDefaultValueSql("now()");
            e.HasOne(lp => lp.Enrollment)
                .WithMany(en => en.LessonProgress)
                .HasForeignKey(lp => lp.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(lp => lp.Lesson)
                .WithMany()
                .HasForeignKey(lp => lp.LessonId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<Review>(e =>
        {
            e.Property(r => r.Comment).HasMaxLength(2000);
            e.Property(r => r.CreatedAt).HasDefaultValueSql("now()");
            e.HasOne(r => r.Enrollment)
                .WithOne(en => en.Review)
                .HasForeignKey<Review>(r => r.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(r => r.EnrollmentId).IsUnique();
            e.ToTable(t => t.HasCheckConstraint("ck_reviews_grade", "grade BETWEEN 1 AND 5"));
        });

        b.Entity<Payment>(e =>
        {
            e.Property(p => p.Amount).HasColumnType("numeric(10,2)");
            e.Property(p => p.Status).IsRequired().HasMaxLength(20);
            e.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
            e.HasOne(p => p.Student)
                .WithMany()
                .HasForeignKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Course)
                .WithMany()
                .HasForeignKey(p => p.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
            e.ToTable(t =>
            {
                t.HasCheckConstraint("ck_payments_status", "status IN ('Completed','Refunded')");
                t.HasCheckConstraint("ck_payments_amount", "amount >= 0");
            });
        });

        b.Entity<Payout>(e =>
        {
            e.Property(p => p.Amount).HasColumnType("numeric(10,2)");
            e.Property(p => p.Status).IsRequired().HasMaxLength(20);
            e.Property(p => p.RequestedAt).HasDefaultValueSql("now()");
            e.HasOne(p => p.Teacher)
                .WithMany()
                .HasForeignKey(p => p.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
            e.ToTable(t =>
            {
                t.HasCheckConstraint("ck_payouts_status", "status IN ('Pending','Approved','Rejected','Paid')");
                t.HasCheckConstraint("ck_payouts_amount", "amount >= 0");
            });
        });
    }
}
