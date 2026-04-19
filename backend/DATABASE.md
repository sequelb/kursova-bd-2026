# Database — Comprehensive Reference

PostgreSQL database for the online learning platform. This document covers the complete schema, all constraints, relationships, triggers, indexes, stored procedures, normalization analysis, and design rationale.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Schema Diagram (text)](#2-schema-diagram-text)
3. [Tables — Detailed Specification](#3-tables--detailed-specification)
4. [Relationships](#4-relationships)
5. [Constraints](#5-constraints)
6. [Indexes](#6-indexes)
7. [Triggers and Stored Procedures](#7-triggers-and-stored-procedures)
8. [Normalization Analysis](#8-normalization-analysis)
9. [Design Decisions and Rationale](#9-design-decisions-and-rationale)
10. [Data Volume](#10-data-volume)
11. [Transaction Usage](#11-transaction-usage)
12. [SQL Examples — Key Queries](#12-sql-examples--key-queries)

---

## 1. Overview

- **DBMS:** PostgreSQL (native install)
- **Database name:** `learningplatform`
- **Naming convention:** `snake_case` for all tables and columns (via EFCore.NamingConventions)
- **Total tables:** 11 (within the 8–12 rubric requirement)
- **Max columns per table:** 8 (within the ≤10 rubric requirement)
- **Total triggers:** 3
- **Total stored procedures/functions:** 4 (1 helper + 2 trigger functions + 1 recommendation function)
- **Total explicit indexes:** 5 (plus 5 implicit from UNIQUE constraints)
- **Total check constraints:** 12
- **Foreign keys:** 14
- **Default values:** 8 columns with defaults

---

## 2. Schema Diagram (text)

```
users ─────────────────────────────────────────────────────────┐
  │ id PK                                                      │
  │ first_name, last_name, email (UNIQUE), password_hash       │
  │ role CHECK('Admin','Teacher','Student')                    │
  │ status CHECK('Active','Suspended') DEFAULT 'Active'        │
  └────────┬──────────────────┬────────────────────────────────┘
           │ 1:1              │ 1:N                1:N
           ▼                  ▼                    ▼
  teacher_profiles      enrollments            payments
    user_id PK/FK         id PK                  id PK
    bio                   student_id FK→users    student_id FK→users
    balance               course_id FK→courses   course_id FK→courses
           │              enrolled_at             amount, status, created_at
           │              progress (denormalized)
           │                  │ 1:N        1:1
           │                  ▼            ▼
           │            lesson_progress  reviews
           │              enrollment_id    id PK
           │              lesson_id        enrollment_id FK (UNIQUE)
           │              completed_at     grade CHECK(1-5)
           │                               comment, created_at
           │
           │ 1:N                          1:N
           ▼                              ▼
        courses ◄─────────────────── course_categories (M2M)
          id PK                       course_id FK
          author_id FK→teacher_profiles   category_id FK
          title, description                    │
          price CHECK(>=0)                      ▼
          level CHECK(B/I/A)              categories
          status CHECK(Draft/Published)     id PK
          created_at                        name (UNIQUE)
              │ 1:N
              ▼
           lessons
             id PK
             course_id FK (CASCADE)
             order_number
             title, content
             UNIQUE(course_id, order_number)

        payouts
          id PK
          teacher_id FK→teacher_profiles
          amount CHECK(>=0)
          status CHECK(Pending/Approved/Rejected/Paid)
          requested_at
```

---

## 3. Tables — Detailed Specification

### 3.1 `users` (7 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `first_name` | `character varying(100)` | NO | — | |
| `last_name` | `character varying(100)` | NO | — | |
| `email` | `character varying(255)` | NO | — | **UNIQUE** |
| `password_hash` | `text` | NO | — | |
| `role` | `character varying(20)` | NO | — | CHECK `IN ('Admin','Teacher','Student')` |
| `status` | `character varying(20)` | NO | `'Active'` | CHECK `IN ('Active','Suspended')` |

**Purpose:** Central user table for all three roles. One table instead of three separate Student/Teacher/Admin tables. Role determined by a text column with a check constraint.

### 3.2 `teacher_profiles` (3 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `user_id` | `integer` | NO | — | **PRIMARY KEY**, FK → `users.id` CASCADE |
| `bio` | `character varying(2000)` | YES | — | |
| `balance` | `numeric(10,2)` | NO | `0` | |

**Purpose:** Teacher-specific attributes. Exists as a separate table because students don't have a bio or balance. The PK being the FK itself (`user_id`) enforces the 1:1 relationship structurally — only one profile per user, and only for users who exist.

**Why not `student_profiles`?** The original ER diagram had a `Student` entity with zero attributes. The rubric says "all entities and attributes must be used in the program." An empty entity violates this, so it was removed. A "student" is simply a `users` row with `role = 'Student'`.

### 3.3 `categories` (2 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `name` | `character varying(60)` | NO | — | **UNIQUE** |

**Purpose:** Course category/subject reference table. Loaded from distinct `subject` values in the Kaggle dataset.

### 3.4 `courses` (8 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `author_id` | `integer` | NO | — | FK → `teacher_profiles.user_id` RESTRICT |
| `title` | `character varying(200)` | NO | — | |
| `description` | `text` | NO | — | |
| `price` | `numeric(10,2)` | NO | — | CHECK `>= 0` |
| `level` | `character varying(20)` | NO | — | CHECK `IN ('Beginner','Intermediate','Advanced')` |
| `status` | `character varying(20)` | NO | — | CHECK `IN ('Draft','Published')` |
| `created_at` | `timestamp with time zone` | NO | `now()` | |

**Purpose:** The core content entity. Teachers create courses; students browse and enroll in them.

**Critical FK design:** `author_id` references `teacher_profiles.user_id`, NOT `users.id`. This means a student's user id cannot be used as an author — the FK would fail because no matching row exists in `teacher_profiles`. The "only teachers can author courses" rule is enforced at the database level, not just in application code.

### 3.5 `course_categories` (2 columns — M2M join table)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `courses_id` | `integer` | NO | — | FK → `courses.id`, part of composite PK |
| `categories_id` | `integer` | NO | — | FK → `categories.id`, part of composite PK |

**Purpose:** Many-to-many relationship between courses and categories. One course can belong to multiple categories. Auto-generated by EF Core from the `Course.Categories ↔ Category.Courses` navigation.

**Note:** Column names are `courses_id` and `categories_id` (plural) because EF Core's M2M convention uses the navigation property names, which are `Courses` and `Categories`.

### 3.6 `lessons` (5 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `course_id` | `integer` | NO | — | FK → `courses.id` CASCADE |
| `order_number` | `integer` | NO | — | |
| `title` | `character varying(200)` | NO | — | |
| `content` | `text` | NO | — | |

**UNIQUE** constraint on `(course_id, order_number)` — no two lessons in the same course can have the same order number.

**CASCADE DELETE:** when a course is deleted, all its lessons are automatically deleted. This is correct because lessons have no meaning without their course.

### 3.7 `enrollments` (5 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `student_id` | `integer` | NO | — | FK → `users.id` RESTRICT |
| `course_id` | `integer` | NO | — | FK → `courses.id` RESTRICT |
| `enrolled_at` | `timestamp with time zone` | NO | `now()` | |
| `progress` | `integer` | NO | `0` | CHECK `BETWEEN 0 AND 100` |

**UNIQUE** constraint on `(student_id, course_id)` — a student can only enroll in a course once.

**RESTRICT DELETE** on both FKs — you cannot delete a user or course that has enrollments. This prevents orphaned enrollment records and enforces that access revocation must be explicit (admin refund).

**Denormalized `progress`:** This column is computed by Trigger #1 (`trg_lesson_progress_recompute`). It equals `(completed lessons / total lessons) × 100`. It's denormalized because computing it on every "My Learning" page load would require joining `lesson_progress` with `lessons` — storing it avoids this join. The trigger keeps it in sync.

### 3.8 `lesson_progress` (3 columns — composite PK)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `enrollment_id` | `integer` | NO | — | FK → `enrollments.id` CASCADE, part of composite PK |
| `lesson_id` | `integer` | NO | — | FK → `lessons.id` RESTRICT, part of composite PK |
| `completed_at` | `timestamp with time zone` | NO | `now()` | |

**Composite primary key** on `(enrollment_id, lesson_id)` — no autoincrement id. This is a pure junction table; its identity IS the relationship it represents.

**CASCADE DELETE** from enrollments — when an enrollment is deleted (e.g., refund), all lesson progress rows are automatically removed.

**RESTRICT DELETE** from lessons — you cannot delete a lesson that students have started (have progress rows for).

**Trigger interaction:** every INSERT or DELETE on this table fires `trg_lesson_progress_recompute`, which recalculates the parent enrollment's `progress` field.

### 3.9 `reviews` (5 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `enrollment_id` | `integer` | NO | — | FK → `enrollments.id` CASCADE, **UNIQUE** |
| `grade` | `integer` | NO | — | CHECK `BETWEEN 1 AND 5` |
| `comment` | `character varying(2000)` | YES | — | |
| `created_at` | `timestamp with time zone` | NO | `now()` | |

**Key design:** `enrollment_id` is UNIQUE — at most one review per enrollment. Combined with the FK to enrollments, this means:
- You can only review a course you're enrolled in (structural enforcement)
- You can only review each course once
- The review is tied to the enrollment, not to (student, course) directly

**CASCADE DELETE:** when an enrollment is deleted (refund), the review is automatically deleted.

### 3.10 `payments` (6 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `student_id` | `integer` | NO | — | FK → `users.id` RESTRICT |
| `course_id` | `integer` | NO | — | FK → `courses.id` RESTRICT |
| `amount` | `numeric(10,2)` | NO | — | CHECK `>= 0` |
| `status` | `character varying(20)` | NO | — | CHECK `IN ('Completed','Refunded')` |
| `created_at` | `timestamp with time zone` | NO | `now()` | |

**Trigger interaction:** every INSERT or UPDATE OF `status` fires `trg_payments_balance`, which recomputes the affected teacher's balance.

**Status lifecycle:** `Completed` (on enrollment) → `Refunded` (by admin). No other transitions.

### 3.11 `payouts` (5 columns)

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `id` | `integer` | NO | `nextval(serial)` | **PRIMARY KEY** |
| `teacher_id` | `integer` | NO | — | FK → `teacher_profiles.user_id` RESTRICT |
| `amount` | `numeric(10,2)` | NO | — | CHECK `>= 0` |
| `status` | `character varying(20)` | NO | — | CHECK `IN ('Pending','Approved','Rejected','Paid')` |
| `requested_at` | `timestamp with time zone` | NO | `now()` | |

**Status lifecycle (state machine):**
```
Pending → Approved → Paid
Pending → Rejected
```

**Trigger interaction:** every INSERT or UPDATE OF `status` fires `trg_payouts_balance`, which recomputes the teacher's balance. Rejected payouts release the locked funds.

---

## 4. Relationships

| Relationship | Type | FK | On Delete | Meaning |
|---|---|---|---|---|
| `users` → `teacher_profiles` | 1:1 | `teacher_profiles.user_id` | CASCADE | Delete user → delete profile |
| `teacher_profiles` → `courses` | 1:N | `courses.author_id` | RESTRICT | Can't delete teacher with courses |
| `courses` ↔ `categories` | M:N | `course_categories` join | — | A course has multiple categories |
| `courses` → `lessons` | 1:N | `lessons.course_id` | CASCADE | Delete course → delete lessons |
| `users` → `enrollments` | 1:N | `enrollments.student_id` | RESTRICT | Can't delete user with enrollments |
| `courses` → `enrollments` | 1:N | `enrollments.course_id` | RESTRICT | Can't delete course with enrollments |
| `enrollments` → `lesson_progress` | 1:N | `lesson_progress.enrollment_id` | CASCADE | Delete enrollment → delete progress |
| `lessons` → `lesson_progress` | 1:N | `lesson_progress.lesson_id` | RESTRICT | Can't delete lesson with progress |
| `enrollments` → `reviews` | 1:1 | `reviews.enrollment_id` (UNIQUE) | CASCADE | Delete enrollment → delete review |
| `users` → `payments` | 1:N | `payments.student_id` | RESTRICT | Can't delete user with payments |
| `courses` → `payments` | 1:N | `payments.course_id` | RESTRICT | Can't delete course with payments |
| `teacher_profiles` → `payouts` | 1:N | `payouts.teacher_id` | RESTRICT | Can't delete teacher with payouts |

### Delete behavior rationale

- **CASCADE** is used when the child has no meaning without the parent (lessons without a course, progress without an enrollment, review without an enrollment, profile without a user).
- **RESTRICT** is used when deletion should be a conscious decision with preconditions (can't just delete a user who has enrollments — must refund first).

---

## 5. Constraints

### Check constraints (12 total)

| Table | Constraint name | Expression | Purpose |
|---|---|---|---|
| `users` | `ck_users_role` | `role IN ('Admin','Teacher','Student')` | Only valid roles |
| `users` | `ck_users_status` | `status IN ('Active','Suspended')` | Only valid statuses |
| `courses` | `ck_courses_status` | `status IN ('Draft','Published')` | Only valid publication states |
| `courses` | `ck_courses_level` | `level IN ('Beginner','Intermediate','Advanced')` | Only valid difficulty levels |
| `courses` | `ck_courses_price` | `price >= 0` | No negative prices |
| `enrollments` | `ck_enrollments_progress` | `progress BETWEEN 0 AND 100` | Valid percentage range |
| `reviews` | `ck_reviews_grade` | `grade BETWEEN 1 AND 5` | Valid star rating |
| `payments` | `ck_payments_status` | `status IN ('Completed','Refunded')` | Only valid payment states |
| `payments` | `ck_payments_amount` | `amount >= 0` | No negative payments |
| `payouts` | `ck_payouts_status` | `status IN ('Pending','Approved','Rejected','Paid')` | Only valid payout states |
| `payouts` | `ck_payouts_amount` | `amount >= 0` | No negative payouts |

### Why text + CHECK instead of PostgreSQL ENUM types?

1. **Easier to evolve:** Adding a new status to a CHECK constraint is `ALTER TABLE ... DROP CONSTRAINT ...; ALTER TABLE ... ADD CONSTRAINT ...;`. Adding a value to a postgres ENUM requires `ALTER TYPE ... ADD VALUE`, which can't run inside a transaction.
2. **EF Core compatibility:** EF Core handles text columns natively. ENUM types require Npgsql-specific configuration and don't always serialize correctly.
3. **Human-readable:** `SELECT * FROM users WHERE role = 'Student'` is more readable than `WHERE role = 1`.

### Unique constraints (5 total)

| Table | Columns | Purpose |
|---|---|---|
| `users` | `email` | No duplicate emails |
| `categories` | `name` | No duplicate category names |
| `lessons` | `(course_id, order_number)` | No duplicate lesson ordering within a course |
| `enrollments` | `(student_id, course_id)` | A student can only enroll once per course |
| `reviews` | `enrollment_id` | At most one review per enrollment |

---

## 6. Indexes

### Implicit indexes (5 — auto-created by UNIQUE constraints)

| Index | Table | Column(s) |
|---|---|---|
| `ix_users_email` | `users` | `email` |
| `ix_categories_name` | `categories` | `name` |
| `ix_lessons_course_id_order_number` | `lessons` | `(course_id, order_number)` |
| `ix_enrollments_student_id_course_id` | `enrollments` | `(student_id, course_id)` |
| `ix_reviews_enrollment_id` | `reviews` | `enrollment_id` |

### Explicit indexes (5 — created in migration `ExplicitIndexes`)

| Index name | Table | Column | Justified by |
|---|---|---|---|
| `idx_courses_author_id` | `courses` | `author_id` | Teacher's "My Courses" (`WHERE author_id = @id`), author page, recommendation procedure |
| `idx_enrollments_student_id` | `enrollments` | `student_id` | Student's "My Learning" (`WHERE student_id = @id`), recommendation procedure |
| `idx_enrollments_course_id` | `enrollments` | `course_id` | Course detail enrollment count (`COUNT WHERE course_id = @id`), teacher analytics |
| `idx_payments_course_id` | `payments` | `course_id` | Admin payments search, teacher revenue sum, balance trigger |
| `idx_payouts_teacher_id` | `payouts` | `teacher_id` | Teacher earnings list, admin payouts search, balance trigger |

Each explicit index corresponds to a query that runs on a frequently-accessed page. Without these indexes, postgres would perform sequential scans on tables with tens of thousands of rows.

---

## 7. Triggers and Stored Procedures

### Trigger #1: `trg_lesson_progress_recompute`

```sql
CREATE TRIGGER trg_lesson_progress_recompute
AFTER INSERT OR DELETE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION recompute_enrollment_progress();
```

**Function:** `recompute_enrollment_progress()`

```sql
CREATE OR REPLACE FUNCTION recompute_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    target_enrollment_id INT;
    total_lessons INT;
    done_lessons INT;
BEGIN
    target_enrollment_id := COALESCE(NEW.enrollment_id, OLD.enrollment_id);

    SELECT COUNT(*) INTO total_lessons
    FROM lessons l
    JOIN enrollments e ON e.course_id = l.course_id
    WHERE e.id = target_enrollment_id;

    SELECT COUNT(*) INTO done_lessons
    FROM lesson_progress
    WHERE enrollment_id = target_enrollment_id;

    UPDATE enrollments
    SET progress = CASE
        WHEN total_lessons = 0 THEN 0
        ELSE (done_lessons * 100) / total_lessons
    END
    WHERE id = target_enrollment_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

**When it fires:** after a student marks a lesson as complete (INSERT) or unmarks it (DELETE).

**What it does:** counts total lessons in the course and completed lessons for this enrollment, computes the percentage, updates `enrollments.progress`.

**Why `COALESCE(NEW, OLD)`:** on INSERT, `NEW` has the row data and `OLD` is null. On DELETE, `OLD` has the row data and `NEW` is null. `COALESCE` picks whichever is available.

**Why a trigger:** the `progress` field is denormalized (derived from `lesson_progress` count / `lessons` count). A trigger ensures it stays in sync regardless of how `lesson_progress` is modified — via the application, via psql, via the data loader. No application code can "forget" to update it.

### Helper procedure: `recompute_teacher_balance(target_teacher_id INT)`

```sql
CREATE OR REPLACE FUNCTION recompute_teacher_balance(target_teacher_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE teacher_profiles tp
    SET balance = COALESCE((
        SELECT SUM(p.amount)
        FROM payments p
        JOIN courses c ON c.id = p.course_id
        WHERE c.author_id = tp.user_id
          AND p.status = 'Completed'
    ), 0) - COALESCE((
        SELECT SUM(po.amount)
        FROM payouts po
        WHERE po.teacher_id = tp.user_id
          AND po.status IN ('Pending', 'Approved', 'Paid')
    ), 0)
    WHERE tp.user_id = target_teacher_id;
END;
$$ LANGUAGE plpgsql;
```

**Formula:** `balance = sum(completed payments for teacher's courses) − sum(non-rejected payouts)`

- Completed payments increase balance (students paid for the teacher's courses)
- Pending/Approved/Paid payouts decrease balance (money locked or withdrawn)
- Rejected payouts are EXCLUDED (money released back)

This is a **full recompute from scratch**, not an incremental delta. Simple and correct — at our data scale, scanning `payments` and `payouts` per trigger fire is negligible.

### Trigger #2: `trg_payments_balance`

```sql
CREATE TRIGGER trg_payments_balance
AFTER INSERT OR UPDATE OF status ON payments
FOR EACH ROW
EXECUTE FUNCTION trg_payments_recompute_balance();
```

**When it fires:**
- Student enrolls → payment INSERT with `status = 'Completed'` → balance increases
- Admin refunds → payment status UPDATE to `'Refunded'` → balance decreases

### Trigger #3: `trg_payouts_balance`

```sql
CREATE TRIGGER trg_payouts_balance
AFTER INSERT OR UPDATE OF status ON payouts
FOR EACH ROW
EXECUTE FUNCTION trg_payouts_recompute_balance();
```

**When it fires:**
- Teacher requests payout → payout INSERT with `status = 'Pending'` → balance decreases
- Admin approves → status UPDATE to `'Approved'` → no balance change (still deducted)
- Admin marks paid → status UPDATE to `'Paid'` → no balance change
- Admin rejects → status UPDATE to `'Rejected'` → balance increases (funds released)

### Stored procedure: `get_recommendations(target_student_id INT, max_results INT)`

See `backend/RECOMMENDATIONS.md` for the complete theory and SQL. Returns `(course_id, score, confidence, lift, reason)`. Implements association rule mining with 5 scoring signals.

---

## 8. Normalization Analysis

### First Normal Form (1NF) ✅

All tables satisfy 1NF:
- Every column contains atomic values (no arrays, no repeating groups)
- Every table has a primary key
- All values in a column are of the same type

### Second Normal Form (2NF) ✅

All tables with composite keys satisfy 2NF:
- `lesson_progress(enrollment_id, lesson_id)` — `completed_at` depends on the full composite key (when THIS student completed THIS lesson in THIS enrollment), not on either key alone
- `course_categories(courses_id, categories_id)` — no non-key attributes, so 2NF is trivially satisfied

### Third Normal Form (3NF) — with one justified exception

All tables satisfy 3NF except:

**Exception: `enrollments.progress`**

`progress` is functionally dependent on `(enrollment_id)` via a calculation over `lesson_progress` and `lessons`. It's a derived/computed value that could be calculated on the fly instead of stored.

**Justification for the violation:**
1. The "My Learning" page (student dashboard) displays progress for every enrolled course. Computing it live would require a JOIN + GROUP BY + COUNT for every enrollment on every page load.
2. The trigger `trg_lesson_progress_recompute` keeps it automatically in sync — the denormalization cost (data redundancy) is mitigated by the trigger guarantee.
3. The CHECK constraint `progress BETWEEN 0 AND 100` adds a safety net even if the trigger has a bug.

This is a textbook example of **controlled denormalization for performance**, documented and defended.

---

## 9. Design Decisions and Rationale

### Single `users` table instead of separate Student/Teacher/Admin tables

**Decision:** one table with a `role` column and a CHECK constraint.

**Rationale:**
- Users share the same core attributes (name, email, password)
- Authentication needs one lookup table (email → user)
- The rubric limits us to 8–12 tables. Three separate user tables would consume 3 of our budget for the same concept.
- Teacher-specific fields (`bio`, `balance`) live in `teacher_profiles` (1:1). Student has no specific fields.

### Text columns with CHECK constraints instead of ENUM types

**Decision:** `role`, `status`, `level`, and all status fields are `VARCHAR` with CHECK constraints.

**Rationale:** see section 5.

### `courses.author_id` → `teacher_profiles.user_id` instead of `→ users.id`

**Decision:** FK references the profile table, not the users table.

**Rationale:** structurally prevents students from authoring courses. A student's `users.id` has no corresponding row in `teacher_profiles`, so the FK would fail. This is a database-level business rule enforcement.

### `reviews.enrollment_id` (UNIQUE) instead of `(student_id, course_id)`

**Decision:** reviews FK to enrollments, not directly to student + course.

**Rationale:** enforces "you can only review what you're enrolled in" structurally. If reviews referenced `(student_id, course_id)` directly, a review could theoretically exist without an enrollment.

### Composite PK on `lesson_progress` instead of autoincrement id

**Decision:** PK is `(enrollment_id, lesson_id)` with no separate `id` column.

**Rationale:** this is a junction table — its identity IS the relationship. An autoincrement id would add a column that's never referenced by any FK and never used in any query. The composite PK naturally enforces uniqueness (one completion record per enrollment × lesson pair).

---

## 10. Data Volume

With the full Kaggle dataset loaded:

| Table | Approximate rows | Notes |
|---|---|---|
| `users` | ~2,400 | ~570 teachers + ~1,700 students + 1 admin |
| `teacher_profiles` | ~570 | One per teacher |
| `categories` | 4 | From the Kaggle dataset's `subject` field |
| `courses` | ~3,400 | Real titles/prices from the CSV |
| `course_categories` | ~3,400 | Most courses have 1 category |
| `lessons` | ~27,000 | Count from CSV's `num_lectures`, capped at 8 |
| `enrollments` | ~17,000 | ~5 per course on average |
| `lesson_progress` | ~50,000+ | Random completion, avg ~34% per enrollment |
| `reviews` | ~13,500 | ~80% of enrollments have reviews |
| `payments` | ~17,000 | One per enrollment |
| `payouts` | ~850 | 0-3 per teacher |
| **Total** | **~135,000+** | |

---

## 11. Transaction Usage

### Enrollment (EnrollmentsController.Enroll)

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
db.Payments.Add(payment);
db.Enrollments.Add(enrollment);
await db.SaveChangesAsync();
await tx.CommitAsync();
```

Creates a payment AND an enrollment atomically. If either fails, both roll back. The payment INSERT fires the balance trigger within the same transaction.

### Refund (AdminFinanceController.Refund)

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
payment.Status = PaymentStatus.Refunded;
db.Enrollments.Remove(enrollment);
await db.SaveChangesAsync();
await tx.CommitAsync();
```

Flips the payment status AND deletes the enrollment atomically. The status change fires the balance trigger (debits teacher). The enrollment deletion cascades to `lesson_progress` and `reviews`.

### Lesson reorder (TeacherCoursesController.Reorder)

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
// Pass 1: set all order_numbers to negative (avoids UNIQUE constraint violations)
foreach (var l in lessons) l.OrderNumber = temp--;
await db.SaveChangesAsync();
// Pass 2: set final order_numbers
for (var i = 0; i < ids.Length; i++) lessonsById[ids[i]].OrderNumber = i + 1;
await db.SaveChangesAsync();
await tx.CommitAsync();
```

Two-pass reorder to avoid violating the `(course_id, order_number)` UNIQUE constraint. Both passes are in one transaction — if the second fails, the first is rolled back and order numbers are unchanged.

---

## 12. SQL Examples — Key Queries

### Student catalog with filters

```sql
SELECT c.*, AVG(r.grade) as avg_rating, COUNT(DISTINCT e.id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
LEFT JOIN reviews r ON r.enrollment_id = e.id
WHERE c.status = 'Published'
  AND c.title ILIKE '%react%'
  AND c.price BETWEEN 0 AND 100
  AND EXISTS (
    SELECT 1 FROM course_categories cc
    WHERE cc.courses_id = c.id AND cc.categories_id IN (1, 3)
  )
GROUP BY c.id
ORDER BY c.created_at DESC
LIMIT 12 OFFSET 0;
```

### Teacher's course analytics

```sql
SELECT
  COUNT(*) as enrollment_count,
  SUM(CASE WHEN e.progress >= 100 THEN 1 ELSE 0 END)::float / COUNT(*) * 100 as completion_rate,
  (SELECT SUM(amount) FROM payments WHERE course_id = @id AND status = 'Completed') as revenue,
  (SELECT AVG(grade) FROM reviews r JOIN enrollments e2 ON e2.id = r.enrollment_id WHERE e2.course_id = @id) as avg_rating
FROM enrollments e
WHERE e.course_id = @id;
```

### Admin financial dashboard

```sql
SELECT
  SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as gross_revenue,
  SUM(CASE WHEN status = 'Refunded' THEN amount ELSE 0 END) as total_refunds
FROM payments
WHERE created_at >= @from AND created_at < @to;
```

### Recommendation query (simplified)

```sql
SELECT * FROM get_recommendations(42, 6);
-- Returns: course_id, score, confidence, lift, reason
```

Internally, the procedure performs a three-way self-join on `enrollments` to find co-enrollment patterns, computes confidence and lift for each association rule, and ranks by a composite score that incorporates peer completion quality, course ratings, and category affinity.
