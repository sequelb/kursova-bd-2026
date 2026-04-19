# Recommendation Algorithm — Theory & Implementation

## Overview

The system recommends courses to students using **association rule mining** — a technique from data mining (also known as **market basket analysis**). The core idea: discover patterns in enrollment data ("students who took course X also took course Y") and use those patterns to suggest courses the current student hasn't taken yet.

The algorithm is implemented as a **PostgreSQL stored procedure** (`get_recommendations`) that can be called directly from `psql` or through the API endpoint `GET /api/me/recommendations`.

---

## Theoretical Foundation

### Association Rules

An **association rule** has the form:

```
{antecedent} → {consequent}
```

In our context:

```
{Course A} → {Course B}
```

Meaning: "students who enrolled in Course A tend to also enroll in Course B."

Each rule is evaluated using three standard metrics:

### 1. Support

**What it measures:** How frequently do courses A and B appear together across all students?

```
support(A → B) = |students enrolled in both A and B| / |total students|
```

**Example:** If 50 out of 500 students took both "React for Beginners" and "Advanced JavaScript", then:
```
support = 50 / 500 = 0.10 (10%)
```

**Interpretation:** 10% of all students took both courses. Higher support means the pattern is more common (and thus more reliable).

### 2. Confidence

**What it measures:** If a student took course A, what is the probability they also took course B?

```
confidence(A → B) = |students in both A and B| / |students in A|
```

**Example:** If 100 students took "React for Beginners" and 50 of those also took "Advanced JavaScript":
```
confidence = 50 / 100 = 0.50 (50%)
```

**Interpretation:** 50% of React students also took Advanced JavaScript. This is the *predictive power* of the rule — "if you took React, there's a 50% chance you'd also like Advanced JS."

### 3. Lift

**What it measures:** Is this association stronger than what you'd expect by random chance?

```
lift(A → B) = confidence(A → B) / P(B)

where P(B) = |students in B| / |total students|
```

**Example:** If 200 out of 500 students took "Advanced JavaScript" (regardless of React):
```
P(B) = 200 / 500 = 0.40 (baseline probability)
lift = 0.50 / 0.40 = 1.25
```

**Interpretation:**
- **Lift > 1** — the association is **stronger** than random chance. React students take Advanced JS 1.25× more often than the average student. This is a real pattern worth recommending.
- **Lift = 1** — no association. Taking React has no effect on the probability of taking Advanced JS. They're independent.
- **Lift < 1** — **negative** association. React students are *less* likely to take Advanced JS than average. This would be an anti-recommendation.

---

## Our Implementation

### Scoring Formula

For each candidate course, the algorithm computes a **composite score** that combines five signals:

```
score = SUM(confidence × lift × completion_weight)
      × rating_multiplier
      × category_multiplier
```

#### Signal 1: Association Rules (confidence × lift)

For each of the student's enrolled courses, the algorithm finds co-enrollment patterns with other students. Each pattern produces a (confidence, lift) pair. Multiplying them ensures we favor rules that are both **predictive** (high confidence) AND **non-trivial** (high lift).

#### Signal 2: Peer Completion Weight

Not all peers are equally informative. A student who **completed** the shared course (progress = 100%) is a stronger signal than one who enrolled but never started.

```
completion_weight = 0.5 + 0.5 × (peer_progress / 100)
```

| Peer progress | Weight | Meaning |
|---|---|---|
| 0% (enrolled, never started) | 0.5 | Still counts, half strength |
| 50% (halfway) | 0.75 | Decent signal |
| 100% (finished) | 1.0 | Full strength |

**Why 0.5 floor?** Enrollment itself is a meaningful signal — the student chose to pay for the course. Completion enhances the signal but shouldn't gatekeep it entirely. With an average completion rate of ~34% in our data, a strict "completers only" filter would discard most of the signal.

#### Signal 3: Rating Quality

Courses with higher average ratings get boosted. We don't want to recommend courses that many people took but nobody enjoyed.

```
rating_multiplier = COALESCE(avg_rating, 3.0) / 5.0
```

| Average rating | Multiplier | Effect |
|---|---|---|
| 5.0★ | 1.0 | Full score |
| 4.0★ | 0.8 | Slight reduction |
| 3.0★ (or unrated) | 0.6 | Neutral default |
| 2.0★ | 0.4 | Significant penalty |
| 1.0★ | 0.2 | Heavy penalty |

**Why default to 3.0?** Unrated courses are not necessarily bad — they might just be new. A neutral score avoids both rewarding and penalizing the absence of data.

#### Signal 4: Category Affinity

If the recommended course shares categories with courses the student has already taken, it gets a small bonus. This captures the intuition that students tend to prefer topics they've already shown interest in.

```
category_multiplier = 1.0 + 0.2 × overlapping_categories
```

| Overlap | Multiplier | Effect |
|---|---|---|
| 0 categories | 1.0 | No bonus |
| 1 category | 1.2 | +20% |
| 2 categories | 1.4 | +40% |

**Why only 20% per category?** This is a weak signal by design. The association rules (Signal 1) already capture cross-category discovery — if programming students frequently take design courses, the rules will surface that pattern. The category bonus is a tiebreaker, not a primary driver.

### Cold-Start Handling

Students with **zero enrollments** can't benefit from association rules (there are no shared courses to base recommendations on). For these students, the algorithm falls back to **popularity-based recommendations** — simply returning the courses with the most enrollments.

```
IF student has 0 enrollments:
    RETURN most popular published courses
```

This is a pragmatic solution. As soon as the student enrolls in their first course, association rules kick in and recommendations become personalized.

### Reason Text

Each recommendation includes a human-readable explanation:

```
"47% of students who took 'React for Beginners' also took this (1.8× above average)"
```

This is built from the **best rule** (highest confidence × lift) for each recommended course. The percentage is the confidence, and the multiplier is the lift.

---

## SQL Implementation

The algorithm is implemented as a single PostgreSQL function:

```sql
SELECT * FROM get_recommendations(student_id);
SELECT * FROM get_recommendations(student_id, 10);  -- custom limit
```

**Returns:** `(course_id, score, confidence, lift, reason)`

### Query structure (CTEs)

1. **`my_courses`** — the student's enrolled courses
2. **`my_categories`** — categories of those courses (for the affinity signal)
3. **`course_enrollment_counts`** — enrollment count per course (for confidence/lift denominators)
4. **`peer_enrollments`** — for each of my courses, find peer students and their other enrollments, including the peer's progress on the shared course
5. **`rule_metrics`** — per-rule confidence, lift, and completion-weighted peer count
6. **`best_rule`** — the strongest rule per recommended course (for the reason text)
7. **`avg_ratings`** — average review grade per course
8. **`cat_overlap`** — category overlap between recommended courses and the student's interests
9. **`scored`** — final composite score combining all five signals

### Performance

The query involves a three-way self-join on the `enrollments` table (my enrollments → peer enrollments on shared courses → peer enrollments on other courses). With ~20,000 enrollments, this executes in under 100ms on a typical machine. For larger datasets, explicit indexes on `enrollments(student_id)` and `enrollments(course_id)` would help (these are planned in Step 9).

---

## API Endpoint

```
GET /api/me/recommendations    [Authorize(Roles = "Student")]
```

**Returns:** `RecommendedCourseDto[]` — same shape as catalog course cards, plus:
- `score` — the composite recommendation score
- `confidence` — confidence of the strongest rule (percentage)
- `lift` — lift of the strongest rule (multiplier)
- `reason` — human-readable explanation

The endpoint calls the SQL function via `db.Database.SqlQuery<RawRecommendation>(...)`, then hydrates each course with full details (author, categories, ratings) for the frontend.

---

## Frontend

The student's **Dashboard** (`/my-learning`) shows a "Recommended Courses" section below "My Learning Progress".

- Course cards in a 3-column grid (same visual style as the catalog)
- Each card has an **(i) icon** in the top-right corner
- Hovering the icon shows a tooltip with:
  - The reason text ("47% of students who took 'React' also took this (1.8× above average)")
  - Confidence percentage
  - Lift multiplier
  - Average rating
  - Composite score
- A **"Show explanations" checkbox** in the section header toggles the (i) icons on/off

---

## Design Decisions

**Why association rules and not collaborative filtering (e.g., matrix factorization)?**
Association rules are fully interpretable — each recommendation has a clear "because" explanation. Matrix factorization produces better recommendations at scale but is a black box. For a coursework defense, being able to explain *why* each course is recommended is more valuable than marginal accuracy gains.

**Why a SQL stored procedure and not application-level code?**
1. Callable directly from `psql` during the defense — the professor can run `SELECT * FROM get_recommendations(42)` and see results.
2. Demonstrates advanced SQL (CTEs, window functions, aggregation, PL/pgSQL).
3. The algorithm is fundamentally a data query — it reads from existing tables and produces a derived result. SQL is the natural language for this.
4. Adds to the procedure/trigger count for the rubric.

**Why five signals instead of just co-enrollment count?**
Raw co-enrollment count (support) is biased toward popular courses — a course that everyone takes will appear in every recommendation regardless of relevance. Confidence and lift correct for this:
- Confidence measures relevance ("of people who share your course, how many took this?")
- Lift measures non-triviality ("is this more than just a popular course?")
Rating quality and category affinity add domain-specific refinement that pure co-enrollment patterns can't capture.

**Why the 0.5 floor on completion weight?**
See Signal 2 above. The key insight: enrollment is the *action* (the student chose to pay), completion is the *quality* of that action. Both carry signal; completion is just a stronger version.
