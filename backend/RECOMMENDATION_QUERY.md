# Recommendation Query — Line-by-Line SQL Walkthrough

This document explains the `get_recommendations` SQL function in detail. For the theory behind the algorithm (association rules, confidence, lift, scoring formula), see [RECOMMENDATIONS.md](RECOMMENDATIONS.md).

---

## Function Signature

```sql
CREATE OR REPLACE FUNCTION get_recommendations(
    target_student_id INT,
    max_results INT DEFAULT 6
)
RETURNS TABLE (course_id INT, score NUMERIC, confidence NUMERIC, lift NUMERIC, reason TEXT)
AS $$ ...
```

**Parameters:**
- `target_student_id` — the student to generate recommendations for
- `max_results` — how many courses to return (default 6, shown in a 3-column grid on the dashboard)

**Returns** a table of recommended courses, each with:

| Column | Type | What it is |
|--------|------|------------|
| `course_id` | INT | The recommended course's primary key |
| `score` | NUMERIC | Composite score combining all 5 signals (higher = better recommendation) |
| `confidence` | NUMERIC | Percentage — "of students who took the shared course, what % also took this one?" |
| `lift` | NUMERIC | Multiplier — "how much more likely is this than random chance?" (>1 = real pattern) |
| `reason` | TEXT | Human-readable explanation, e.g. "47% of students who took 'React' also took this (1.8x above average)" |

---

## Local Variables

```sql
DECLARE
    student_course_count INT;
    total_students INT;
BEGIN
    SELECT COUNT(*) INTO student_course_count
    FROM enrollments WHERE student_id = target_student_id;

    SELECT COUNT(DISTINCT student_id) INTO total_students
    FROM enrollments;
```

Before the main query, we compute two things:
- `student_course_count` — how many courses the target student is enrolled in. If it's 0, we take the cold-start path.
- `total_students` — total number of unique students on the platform. Used later to compute lift (which needs the global probability of enrolling in a course).

---

## Cold-Start Path (New Students)

```sql
IF student_course_count = 0 THEN
    RETURN QUERY
    SELECT
        c.id AS course_id,
        COUNT(e.id)::NUMERIC AS score,
        0::NUMERIC AS confidence,
        0::NUMERIC AS lift,
        'Popular on the platform'::TEXT AS reason
    FROM courses c
    LEFT JOIN enrollments e ON e.course_id = c.id
    WHERE c.status = 'Published'
    GROUP BY c.id
    ORDER BY score DESC
    LIMIT max_results;
    RETURN;
END IF;
```

A student with zero enrollments has no data for association rules. There are no "shared courses" to find peers through. So we fall back to **popularity**: return the published courses with the most enrollments.

- `confidence` and `lift` are set to 0 because there are no association rules.
- `score` is simply the enrollment count.
- The reason text is a generic "Popular on the platform."

As soon as the student enrolls in one course, this path is skipped and the full algorithm runs.

---

## Main Query — CTE by CTE

The main query is one big `RETURN QUERY` with 9 CTEs (Common Table Expressions) chained together. Each CTE builds on the previous ones. Think of them as temporary named tables that exist only during this query.

### CTE 1: `my_courses`

```sql
my_courses AS (
    SELECT e.course_id
    FROM enrollments e
    WHERE e.student_id = target_student_id
)
```

Simple starting point: get all course IDs the target student is enrolled in. These are the courses we'll use to find peers, and also the courses we need to **exclude** from recommendations (don't recommend something they already have).

**Example:** If the student is enrolled in courses 10, 25, and 42, this returns `{10, 25, 42}`.

---

### CTE 2: `my_categories`

```sql
my_categories AS (
    SELECT DISTINCT cc.categories_id AS cat_id
    FROM my_courses mc
    JOIN course_categories cc ON cc.courses_id = mc.course_id
)
```

Collects all unique category IDs from the student's courses. Used later in the category affinity signal.

**Example:** If course 10 has categories "Web Dev" and "JavaScript", and course 25 has "Web Dev" and "React", this returns `{Web Dev, JavaScript, React}`.

The `DISTINCT` ensures each category appears once even if multiple courses share it.

---

### CTE 3: `course_enrollment_counts`

```sql
course_enrollment_counts AS (
    SELECT enr.course_id, COUNT(DISTINCT enr.student_id) AS cnt
    FROM enrollments enr
    GROUP BY enr.course_id
)
```

Pre-computes enrollment counts for every course on the platform. These numbers are used as denominators in the confidence and lift formulas:

- **Confidence denominator:** How many students are enrolled in the shared course? (If 100 students took course A and 30 also took course B, confidence = 30/100 = 30%)
- **Lift denominator:** How many students are enrolled in the recommended course? This gives us P(B) = cnt / total_students, the baseline probability.

Computing this once and joining later is more efficient than doing a subquery for each rule.

---

### CTE 4: `peer_enrollments` (the core join)

```sql
peer_enrollments AS (
    SELECT
        e_mine.course_id   AS shared_course_id,
        e_other.course_id  AS rec_course_id,
        e_other.student_id AS peer_id,
        e_peer.progress    AS peer_shared_progress
    FROM enrollments e_mine
    JOIN enrollments e_peer
        ON e_peer.course_id = e_mine.course_id
       AND e_peer.student_id != target_student_id
    JOIN enrollments e_other
        ON e_other.student_id = e_peer.student_id
    WHERE e_mine.student_id = target_student_id
      AND e_other.course_id NOT IN (SELECT mc.course_id FROM my_courses mc)
)
```

This is the heart of the algorithm — a **three-way self-join** on the `enrollments` table. It finds all potential recommendations by discovering what peers enrolled in.

**Step by step:**

1. `e_mine` — start with the target student's enrollments.
2. `e_peer` — for each of those courses, find OTHER students who are also enrolled in the same course. These are "peers" — students with shared taste. The `!= target_student_id` condition prevents the student from being their own peer.
3. `e_other` — for each peer, find what other courses they're enrolled in.
4. `NOT IN (SELECT ... FROM my_courses)` — exclude courses the target student already has.

**The columns:**
- `shared_course_id` — the course that connects the target student to the peer (the "because you took X" part)
- `rec_course_id` — the course the peer has that the target student doesn't (the actual recommendation)
- `peer_id` — which peer student this came from
- `peer_shared_progress` — how far the peer progressed in the shared course (used for completion weighting)

**Example:**
- Target student took courses {10, 25}
- Student #7 also took course 10 (with 80% progress) and additionally took course 55
- This produces a row: `shared_course_id=10, rec_course_id=55, peer_id=7, peer_shared_progress=80`
- Meaning: "Because you and student #7 both took course 10, and they also took course 55, maybe you'd like course 55 too."

This CTE will have MANY rows — one for every (my_course, peer, peer's_other_course) combination. The next CTEs aggregate them.

---

### CTE 5: `rule_metrics`

```sql
rule_metrics AS (
    SELECT
        pe.rec_course_id,
        pe.shared_course_id,
        COUNT(DISTINCT pe.peer_id) AS co_count,
        COUNT(DISTINCT pe.peer_id)::NUMERIC
            / NULLIF(cec_shared.cnt, 0) AS rule_confidence,
        (COUNT(DISTINCT pe.peer_id)::NUMERIC
            / NULLIF(cec_shared.cnt, 0))
            / NULLIF(cec_rec.cnt::NUMERIC / NULLIF(total_students, 0), 0)
        AS rule_lift,
        SUM(0.5 + 0.5 * pe.peer_shared_progress / 100.0) AS weighted_peers
    FROM peer_enrollments pe
    JOIN course_enrollment_counts cec_shared
        ON cec_shared.course_id = pe.shared_course_id
    JOIN course_enrollment_counts cec_rec
        ON cec_rec.course_id = pe.rec_course_id
    GROUP BY pe.rec_course_id, pe.shared_course_id,
             cec_shared.cnt, cec_rec.cnt
)
```

Groups the raw peer enrollments into **association rules** and computes metrics for each rule. A "rule" is a specific (shared_course, recommended_course) pair.

**Computed columns:**

**`co_count`** — how many distinct peers took both the shared course and the recommended course. This is the numerator for confidence.

**`rule_confidence`** — the association rule confidence:
```
confidence = co_count / total_enrolled_in_shared_course
```
The `NULLIF(..., 0)` prevents division by zero. `::NUMERIC` casts to decimal for precise division (integer division in PostgreSQL truncates).

**`rule_lift`** — how much stronger this rule is compared to random chance:
```
lift = confidence / (enrolled_in_recommended / total_students)
```
If the recommended course has 200 enrollments out of 1000 total students, P(recommended) = 0.2. If confidence is 0.4, lift = 0.4 / 0.2 = 2.0, meaning peers are 2x more likely to take this course than a random student.

**`weighted_peers`** — the sum of completion-weighted peer contributions:
```
weight_per_peer = 0.5 + 0.5 * (peer_progress / 100)
```
A peer who completed the shared course (progress = 100%) contributes a weight of 1.0. A peer who enrolled but never started (progress = 0%) contributes 0.5. This avoids throwing away signal from partial completers while still rewarding engaged peers.

**Example:** For rule "course 10 → course 55":
- 30 peers took both (co_count = 30)
- 100 students total in course 10 (confidence = 30/100 = 0.30)
- 150 students total in course 55 out of 1000 total (P(55) = 0.15, lift = 0.30/0.15 = 2.0)
- Sum of completion weights from those 30 peers = 22.5

---

### CTE 6: `best_rule`

```sql
best_rule AS (
    SELECT DISTINCT ON (rm.rec_course_id)
        rm.rec_course_id,
        rm.shared_course_id,
        rm.co_count,
        rm.rule_confidence,
        rm.rule_lift
    FROM rule_metrics rm
    ORDER BY rm.rec_course_id, (rm.rule_confidence * rm.rule_lift) DESC
)
```

A recommended course might appear through **multiple** shared courses. For example, course 55 might be recommended both via "you took course 10" (confidence 30%, lift 2.0) and "you took course 25" (confidence 15%, lift 1.2). The final score combines ALL rules, but the **reason text** shown to the user should cite the single strongest rule.

`DISTINCT ON (rec_course_id)` is a PostgreSQL-specific feature: it keeps only the first row per `rec_course_id`, after ordering by `confidence * lift` descending. This picks the rule with the highest combined predictive power.

---

### CTE 7: `avg_ratings`

```sql
avg_ratings AS (
    SELECT
        e.course_id AS rec_course_id,
        COALESCE(AVG(r.grade), 3.0) AS avg_rating
    FROM reviews r
    JOIN enrollments e ON e.id = r.enrollment_id
    GROUP BY e.course_id
)
```

Computes the average review grade (1-5 stars) for each course. Reviews are linked through enrollments (a review belongs to an enrollment, which belongs to a course).

`COALESCE(..., 3.0)` handles courses with no reviews — they get a neutral 3.0 rather than NULL, which would break the multiplication in the scoring formula. A 3.0 maps to a 0.6 multiplier (3.0/5.0), so unrated courses are neither boosted nor penalized.

---

### CTE 8: `cat_overlap`

```sql
cat_overlap AS (
    SELECT
        cc.courses_id AS rec_course_id,
        COUNT(mc.cat_id) AS overlap_count
    FROM course_categories cc
    JOIN my_categories mc ON mc.cat_id = cc.categories_id
    GROUP BY cc.courses_id
)
```

Counts how many categories each potential recommendation shares with the student's existing courses (from CTE 2).

If the student has courses in "Web Dev" and "JavaScript", and a recommended course is also in "Web Dev", `overlap_count = 1`. If it's in both "Web Dev" and "JavaScript", `overlap_count = 2`.

Courses with zero overlap simply won't appear in this CTE, and `COALESCE` in the scoring step handles the missing value as 0.

---

### CTE 9: `scored` (final scoring)

```sql
scored AS (
    SELECT
        rm.rec_course_id,
        SUM(rm.rule_confidence * COALESCE(rm.rule_lift, 1)
            * rm.weighted_peers)
            * (COALESCE(ar.avg_rating, 3.0) / 5.0)
            * (1.0 + 0.2 * COALESCE(co.overlap_count, 0))
        AS final_score,
        br.shared_course_id,
        br.co_count,
        br.rule_confidence AS best_confidence,
        br.rule_lift AS best_lift
    FROM rule_metrics rm
    JOIN best_rule br ON br.rec_course_id = rm.rec_course_id
    LEFT JOIN avg_ratings ar ON ar.rec_course_id = rm.rec_course_id
    LEFT JOIN cat_overlap co ON co.rec_course_id = rm.rec_course_id
    GROUP BY rm.rec_course_id, br.shared_course_id, br.co_count,
             br.rule_confidence, br.rule_lift,
             ar.avg_rating, co.overlap_count
)
```

Brings everything together into the final composite score:

```
score = SUM(confidence * lift * weighted_peers)   -- association strength
      * (avg_rating / 5.0)                         -- quality filter
      * (1 + 0.2 * category_overlap)               -- topic affinity bonus
```

**Breaking it down:**

1. **`SUM(confidence * lift * weighted_peers)`** — sums across ALL rules for this recommended course. A course that's recommended via 3 different shared courses scores higher than one recommended via only 1. Each rule's contribution is weighted by the strength of the association (confidence * lift) and the quality of the peers (completion weight).

2. **`* (avg_rating / 5.0)`** — rating multiplier. A 5-star course keeps the full score (1.0x). A 2-star course gets penalized to 0.4x. This prevents recommending courses that many people took but nobody liked.

3. **`* (1 + 0.2 * category_overlap)`** — category affinity. Each shared category adds a 20% bonus. This is intentionally a weak signal — the association rules already capture cross-topic patterns. Category overlap is a tiebreaker, not a primary driver.

The `LEFT JOIN` on ratings and categories means courses without reviews or without category overlap still get scored (with neutral defaults via `COALESCE`).

---

### Final SELECT

```sql
SELECT
    s.rec_course_id AS course_id,
    ROUND(s.final_score, 2) AS score,
    ROUND(s.best_confidence * 100, 1) AS confidence,
    ROUND(COALESCE(s.best_lift, 0), 2) AS lift,
    FORMAT('%s%% of students who took "%s" also took this (%s× above average)',
        ROUND(s.best_confidence * 100),
        (SELECT c2.title FROM courses c2 WHERE c2.id = s.shared_course_id),
        ROUND(COALESCE(s.best_lift, 1), 1)
    )::TEXT AS reason
FROM scored s
JOIN courses c ON c.id = s.rec_course_id AND c.status = 'Published'
ORDER BY s.final_score DESC
LIMIT max_results;
```

Formats the results for output:

- **`score`** — rounded to 2 decimal places
- **`confidence`** — converted from a fraction (0.47) to a percentage (47.0)
- **`lift`** — rounded to 2 decimal places
- **`reason`** — a human-readable string built with `FORMAT()`, using the best rule's confidence and lift. The subquery `(SELECT c2.title ...)` looks up the shared course's name for the explanation. Example: `"47% of students who took "React for Beginners" also took this (1.8x above average)"`
- **`c.status = 'Published'`** — only recommend published courses (not drafts)
- **`ORDER BY final_score DESC`** — best recommendations first
- **`LIMIT max_results`** — return only the top N (default 6)

---

## How the API Uses This Function

The controller in `EnrollmentsController.cs` calls the function via raw SQL:

```csharp
var rawResults = await db.Database
    .SqlQuery<RawRecommendation>($"SELECT * FROM get_recommendations({studentId}, 6)")
    .ToListAsync();
```

EF Core maps the returned rows to a `RawRecommendation` class with properties matching the column names (`course_id`, `score`, `confidence`, `lift`, `reason`).

The controller then "hydrates" each result — fetches the full course details (title, author, categories, reviews) from the database and packages them into `RecommendedCourseDto` objects for the frontend. The SQL function intentionally returns only `course_id` and metrics, keeping the function focused on the recommendation logic. Presentation data is added at the application layer.

---

## How to Test It

From `psql`:

```sql
-- Recommendations for student with user_id = 5
SELECT * FROM get_recommendations(5);

-- Recommendations for student with user_id = 5, top 10
SELECT * FROM get_recommendations(5, 10);

-- Cold-start: recommendations for a student with no enrollments
SELECT * FROM get_recommendations(9999);
```

Expected output:

```
 course_id |  score  | confidence | lift | reason
-----------+---------+------------+------+-----------------------------------------------------
       142 |   18.73 |       47.0 | 1.80 | 47% of students who took "React" also took this ...
       203 |   12.41 |       33.5 | 2.10 | 34% of students who took "Node.js" also took this ...
```

---

## Data Flow Summary

```
Student's enrollments
        |
        v
    my_courses ──────────────────────────┐
        |                                |
        v                                v
  peer_enrollments ──> rule_metrics   my_categories
        |                  |              |
        |                  v              v
        |             best_rule      cat_overlap
        |                  |              |
        |                  v              v
        |              scored  <── avg_ratings
        |                  |
        v                  v
                    Final SELECT
                    (sort, format, limit)
                         |
                         v
                  API response (JSON)
                         |
                         v
                  Dashboard cards
                  with (i) tooltip
```

why do we SUM? what does it sum across?                                                                                               
                                                                                                                                        
● The SUM aggregates across all rules for the same recommended course.                                                                  
                                                                                                                                        
  A recommended course can appear via multiple shared courses. Say you took courses A, B, and C. Course X might be recommended through: 
  - Rule "A → X" (confidence 40%, lift 2.0, 15 weighted peers)
  - Rule "B → X" (confidence 25%, lift 1.5, 8 weighted peers)                                                                           
  - Rule "C → X" (confidence 10%, lift 0.8, 3 weighted peers)
                                                                                                                                        
  The GROUP BY rm.rec_course_id collapses these 3 rows into one. The SUM adds up their contributions:                                   
                                                                                                                                        
  SUM = (0.40 * 2.0 * 15) + (0.25 * 1.5 * 8) + (0.10 * 0.8 * 3)                                                                         
      = 12.0 + 3.0 + 0.24                                                                                                               
      = 15.24                                                                                                                           
                                                                                                                                        
  Then that sum gets multiplied by the rating and category bonuses (which are per-course, not per-rule — so they're outside the SUM).   
   
  Why sum instead of taking the best rule? A course recommended via 3 independent paths is a stronger recommendation than one           
  recommended via only 1, even if that one path has higher confidence. The sum rewards courses with multiple supporting patterns.
                                                                                                                                        
❯ didn't we do DISTINCT ON in the previous table ? i don't understand                                                                   
                                                                      
● Good question. The DISTINCT ON in best_rule picks one best rule per recommended course — but that's only used for the reason text (to 
  show the user the single strongest explanation).                                                                                    
                                                                                                                                        
  rule_metrics still has ALL rules. The scored CTE joins back to rule_metrics (not best_rule) for the scoring:                          
                                                                                                                                        
  rule_metrics:  has ALL rules (A→X, B→X, C→X)     ← SUM happens here                                                                   
  best_rule:     has ONE rule per course (A→X only)  ← used only for the reason text                                                    
                                                                                                                                        
  So in scored:                                                                                                                         
  - FROM rule_metrics rm — all rules, multiple rows per recommended course                                                              
  - JOIN best_rule br — brings in the best rule's metadata (for the reason text later)                                                  
  - GROUP BY rm.rec_course_id — collapses all rules into one row, SUMming their scores
                                                                                                                                        
  The best_rule columns (br.shared_course_id, br.rule_confidence, br.rule_lift) are the same value for every row in the group (since    
  there's only one best rule per course), so they're safe in the GROUP BY.                                                              
                                                                                                                                        
  In short: score uses all rules (sum), but the explanation shows only the best one.      







==



 no, i mean if we use just the best rule as the reason it is a bit of a lie isn't it ?                                                 
                                                                                        
● You're right — the score is a sum of all rules, but the reason only explains one of them. So the score might be 15.24 but the reason  
  says "40% of students who took A also took this" which only accounts for 12.0 of that.
                                                                                                                                        
  But it's not really a lie — it's a simplification. The alternative would be something like:                                           
                                                                                                                                        
  ▎ "Recommended because of 3 patterns: 40% from course A (2.0× lift), 25% from course B (1.5× lift), 10% from course C (0.8× lift)"    
                                                            
  That's more honest but much harder to read. The single best rule gives the user the main reason — and it is genuinely the strongest   
  signal. The score being higher than that one rule would suggest just means there's additional supporting evidence, which makes the
  recommendation stronger, not weaker.                                                                                                  
                                                            
  Think of it like a movie recommendation: "Because you liked Inception" is more useful than "Because you liked Inception (60%), The    
  Matrix (25%), and Interstellar (15%)". The first one gives you the intuition; the exact breakdown is noise for most users.
                                                                                                                                        
  For the defense, if asked, you can explain that the reason shows the strongest association rule while the score aggregates all        
  contributing rules — that shows you understand the difference.
