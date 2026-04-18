# Data Loader — Usage Guide

## Prerequisites
- PostgreSQL running, database `learningplatform` exists
- Working directory: `backend/` (or use `--project` from anywhere)

## Quick reference

```fish
cd backend

# Dev mode (small fixture: 6 courses, 3 known accounts)
dotnet run --project src/LearningPlatform.DataLoader -- --dev

# Full mode (3400+ real Udemy courses, ~50k records)
dotnet run --project src/LearningPlatform.DataLoader

# Partial load (first N courses from the CSV)
dotnet run --project src/LearningPlatform.DataLoader -- --limit 200

# Wipe everything and reload (skips the "are you sure?" prompt)
dotnet run --project src/LearningPlatform.DataLoader -- --reset
dotnet run --project src/LearningPlatform.DataLoader -- --reset --dev
dotnet run --project src/LearningPlatform.DataLoader -- --reset --limit 500

# Control enrollment date range
dotnet run --project src/LearningPlatform.DataLoader -- --enroll-from 2025-01-01 --enroll-to 2026-04-15

# Combine flags
dotnet run --project src/LearningPlatform.DataLoader -- --reset --limit 300 --enroll-from 2025-06-01 --enroll-to 2026-04-15

# Show help
dotnet run --project src/LearningPlatform.DataLoader -- --help
```

## What each mode creates

### `--dev` mode

| Table | Records | Details |
|---|---|---|
| categories | 5 | Programming, JavaScript, Web Development, Data Science, Design |
| users (teachers) | 2 | `sarah@local`, `john@local` |
| users (students) | 1 | `alice@local` |
| courses | 6 | 3 by Sarah, 3 by John, all Published |
| lessons | 24 | 4 per course |
| enrollments | 1 | Alice enrolled in "React for Beginners" |
| payments | 1 | Matching the enrollment |
| reviews | 1 | Alice's 5-star review |
| **Total** | **~36** | |

### Full mode (no `--limit`)

| Table | Records | Details |
|---|---|---|
| categories | 4 | Business Finance, Graphic Design, Musical Instruments, Web Development |
| users (teachers) | 80 | Generated names, round-robin course assignment |
| users (students) | 500 | Generated names, each with 1-2 preferred categories |
| courses | ~3400 | Real titles/prices/levels from Kaggle CSV (non-ASCII filtered) |
| lessons | ~27000 | Count from CSV `num_lectures` (capped at 8), lorem ipsum content |
| enrollments | ~5000 | 70% biased toward student's preferred categories, 30% popularity-weighted |
| payments | ~5000 | One per enrollment, dates match enrollment dates |
| lesson_progress | ~13000 | Random completion per enrollment (avg ~34%) |
| reviews | ~200-400 | ~40% of students who finished all lessons leave a review (grade biased 3-5) |
| payouts | ~120 | 0-3 per teacher, mixed statuses |
| **Total** | **~50,000+** | |

## Passwords

| Account | Password |
|---|---|
| `admin@local` | `admin123` |
| Dev mode: `sarah@local`, `john@local`, `alice@local` | `password123` |
| Full mode: all generated users | `password123` |

## Flags

| Flag | What it does |
|---|---|
| *(no flag)* | Full CSV load |
| `--dev` | Small hardcoded fixture instead of CSV |
| `--reset` | Wipe all non-admin data first (skips confirmation prompt) |
| `--limit N` | Only import first N rows from CSV (full mode only) |
| `--enroll-from DATE` | Earliest enrollment date (default: course's publication date) |
| `--enroll-to DATE` | Latest enrollment date (default: today) |
| `-h`, `--help` | Show help |

## Behavior notes

- **Admin user** is always preserved — `--reset` deletes everything except the admin account.
- **If data already exists** and you don't pass `--reset`, you'll get a prompt: "Reset and repopulate? [y/N]"
- **Migrations are applied automatically** before loading — you don't need to run `dotnet run` on the API first.
- **Triggers fire during load** — teacher balances, enrollment progress, etc. are all computed correctly by the database triggers.
- **Enrollment dates** default to random dates between each course's publication date and today. Use `--enroll-from` / `--enroll-to` to narrow the range.
- **Category-biased enrollment**: each student gets 1-2 preferred categories. 70% of their enrollments are biased toward those categories. This makes the recommendation algorithm produce meaningful patterns.

## Common workflows

```fish
# Fresh start for development
dropdb -h localhost -U bodia learningplatform
createdb -h localhost -U bodia learningplatform
dotnet run --project src/LearningPlatform.DataLoader -- --dev

# Fresh start with real data
dropdb -h localhost -U bodia learningplatform
createdb -h localhost -U bodia learningplatform
dotnet run --project src/LearningPlatform.DataLoader

# Quick reload with fewer courses (faster, good for testing)
dotnet run --project src/LearningPlatform.DataLoader -- --reset --limit 100

# Reload with enrollment dates in the last year only
dotnet run --project src/LearningPlatform.DataLoader -- --reset --enroll-from 2025-04-15 --enroll-to 2026-04-15
```
