# Frontend — Code Walkthrough

Real code snippets from actual files with line-by-line explanations.

---

## File: `lib/api.ts` — The Network Layer

### Lines 1-11 — Base URL and core types

```tsx
const BASE = 'http://localhost:5000'

export type Role = 'Admin' | 'Teacher' | 'Student'

export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
}
```

- **Line 1:** hardcoded API URL. In production you'd use an environment variable, but for a local-only coursework this is fine.
- **Lines 3:** `Role` is a **union type** — a variable of type `Role` can only be one of these three strings. TypeScript will error if you try to assign `'Moderator'`.
- **Lines 5-11:** `User` type mirrors the backend's `UserResponse` DTO exactly. If the backend adds a field and you forget to add it here, TypeScript won't error — but you won't have access to the new field. These types are our contract with the backend.

### The `request` function — the single fetch wrapper

```tsx
export const AUTH_INVALIDATED_EVENT = 'lp:auth-invalidated'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && path !== '/api/me') {
      window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT))
    }
    let body: unknown = null
    try { body = await res.json() } catch { /* ignore */ }
    const message =
      (body as { error?: string } | null)?.error ??
      (body as { errors?: string[] } | null)?.errors?.join(', ') ??
      `HTTP ${res.status}`
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
```

**Line by line:**

- `<T>` — this is a **generic function**. The caller specifies what type the response will be: `request<User>(...)` means "the JSON response is a User."
- `credentials: 'include'` — tells the browser to send the `lp.auth` cookie. Without this, cookies are NOT sent to a different origin (`:5173` → `:5000`).
- `...(init.headers ?? {})` — merge any extra headers the caller provides. The `??` is **nullish coalescing** — if `init.headers` is null/undefined, use `{}` instead.
- `...init` — spread the rest of the caller's fetch options (method, body, etc.)
- `!res.ok` — true for any HTTP status >= 400
- **Lines 401/403 handling:** dispatch a DOM event so `AuthProvider` re-fetches `/api/me`. The `path !== '/api/me'` check prevents infinite loops (if `/api/me` itself returns 401, don't re-fetch it).
- `let body: unknown = null` — try to parse the error body as JSON. `unknown` is TypeScript's "I don't know what type this is" — safer than `any` because you can't access properties without a type assertion.
- The error message extraction chain: try `body.error` (our standard), then `body.errors` (array, joined), then fall back to `HTTP 401`.
- `res.status === 204` — No Content responses have no body. Return `undefined` cast to `T`. This is a small type lie, but mutations that return 204 declare their type as `void`.

### The api object — method examples

```tsx
export const api = {
  login: (body: { email: string; password: string }) =>
    request<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  listCourses: (q: CourseQuery = {}) =>
    request<PagedResult<CourseListItem>>('/api/courses' + buildCourseQuery(q)),

  enroll: (courseId: number) =>
    request<EnrollResult>(`/api/courses/${courseId}/enroll`, { method: 'POST' }),

  completeLesson: (enrollmentId: number, lessonId: number) =>
    request<void>(`/api/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, { method: 'POST' }),
}
```

Each method is a one-liner that calls `request` with the right URL + method + body. The return type is specified in the generic parameter.

- `login` — POST with a JSON body, expects a `User` back
- `listCourses` — GET with query string params built by `buildCourseQuery`, expects paginated results
- `enroll` — POST with no body (the course id is in the URL), expects `{ enrollmentId, firstLessonId }`
- `completeLesson` — POST, expects 204 No Content (typed as `void`)

---

## File: `lib/auth.tsx` — Authentication Context

### Lines 17-28 — The context and initial fetch

```tsx
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])
```

- **Line 17:** `createContext` creates a React Context with an initial value of `null`. Contexts are React's way of sharing data across the component tree without passing props through every level.
- **Line 20:** `user` starts as `null` (not logged in). `loading` starts as `true` (we don't know yet).
- **Lines 23-28:** On first render, call `GET /api/me`:
  - If the cookie is valid → `.then(setUser)` stores the user
  - If no cookie or invalid → `.catch(() => setUser(null))` keeps it null
  - Either way → `.finally(() => setLoading(false))` stops the loading state
- The `[]` dependency array means this effect runs ONCE on mount.

### Lines 33-38 — Cross-tab recovery

```tsx
  useEffect(() => {
    const handler = () => {
      api.me().then(setUser).catch(() => setUser(null))
    }
    window.addEventListener(AUTH_INVALIDATED_EVENT, handler)
    return () => window.removeEventListener(AUTH_INVALIDATED_EVENT, handler)
  }, [])
```

This is a **second** `useEffect`, completely independent of the first. It:
1. Defines a handler that re-fetches `/api/me`
2. Listens for the `AUTH_INVALIDATED_EVENT` custom event (dispatched by `api.ts` on 401/403)
3. Returns a **cleanup function** that removes the listener

When the event fires (because some API call got 401), this handler runs, re-fetches the user identity, and updates the state. If the user was replaced (two-tab cookie swap), the new user's data flows through the context, and `RequireAuth` redirects if the role doesn't match.

### Lines 40-57 — The context value

```tsx
  const value: AuthContextValue = {
    user,
    loading,
    login: async (email, password) => {
      const u = await api.login({ email, password })
      setUser(u)
      return u
    },
    register: async (body) => {
      const u = await api.register(body)
      setUser(u)
      return u
    },
    logout: async () => {
      await api.logout()
      setUser(null)
    },
  }
```

The context exposes five things:
- `user` — the current user object (or null)
- `loading` — whether we're still checking the cookie
- `login()` — calls the API, then updates the context state. The Login page calls this.
- `register()` — same pattern
- `logout()` — calls the API (clears the cookie server-side), then sets user to null

### Lines 63-67 — The useAuth hook

```tsx
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
```

`useContext(AuthContext)` reads the nearest `AuthContext.Provider` in the component tree. The `if (!ctx)` check catches the mistake of using `useAuth()` outside of `<AuthProvider>` — without it, you'd get a cryptic null reference error later.

---

## File: `app/components/RequireAuth.tsx`

```tsx
export function RequireAuth({ children, roles }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        You don't have access to this page.
      </div>
    )
  }

  return <>{children}</>
}
```

**Three gates in order:**

1. **Loading** — show a centered loading message. This prevents a flash of the login page while `/api/me` is still in flight.
2. **Not authenticated** — redirect to `/login`. `replace` means pressing "back" won't return to the protected page. `state={{ from: location }}` saves where they were trying to go (the Login page could use this to redirect back after login, though we don't currently).
3. **Wrong role** — show an access denied message. The user IS logged in but doesn't have the required role. We don't redirect because the user should see they're logged in as the wrong role.
4. **All good** — render `{children}` (the protected page). `<>{children}</>` is a React Fragment — it renders the children without adding any extra DOM element.

---

## File: `app/pages/Catalog.tsx` — URL-Driven Filters

### Lines 38-63 — Reading filters from URL params

```tsx
const [searchParams, setSearchParams] = useSearchParams()

const q = searchParams.get('q') ?? ''
const sort = (searchParams.get('sort') as SortKey | null) ?? 'newest'
const minPrice = searchParams.get('minPrice')
const categoryIds = searchParams.getAll('categoryIds').map(Number)
const page = Number(searchParams.get('page') ?? '1') || 1

const query: CourseQuery = useMemo(
  () => ({
    q: q || undefined,
    sort,
    minPrice: minPrice ? Number(minPrice) : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    page,
    pageSize: 12,
  }),
  [q, sort, minPrice, maxPrice, minRating, categoryIds.join(','), page],
)
```

- `useSearchParams()` reads and writes URL query parameters (`?q=react&sort=price_asc`)
- `searchParams.get('q')` → returns the string value or null
- `searchParams.getAll('categoryIds')` → returns ALL values for a repeated key (`?categoryIds=1&categoryIds=3` → `['1', '3']`)
- `as SortKey | null` — type assertion since `get()` returns `string | null` but we know it's one of our sort values
- `|| 1` at the end of page — if `Number('abc')` returns `NaN`, `NaN || 1` falls back to 1

**`useMemo`** — recomputes the `query` object only when its dependencies change. Without this, a new object would be created on every render, which would cause the `useQuery` to think the key changed and re-fetch. The `categoryIds.join(',')` converts the array to a string for comparison (arrays are compared by reference, not value).

### Lines 65-68 — The patchParams helper

```tsx
function patchParams(patch: Record<string, string | string[] | null>) {
  const next = new URLSearchParams(searchParams)
  for (const [k, v] of Object.entries(patch)) {
    next.delete(k)
    if (v == null) continue
    if (Array.isArray(v)) for (const x of v) next.append(k, x)
    else if (v !== '') next.set(k, v)
  }
  setSearchParams(next, { replace: true })
}
```

This helper updates specific URL parameters without losing the others. `patchParams({ sort: 'price_asc' })` changes just the sort param, keeping q, categoryIds, etc. intact.

- `next.delete(k)` — remove the old value first (important for arrays like categoryIds)
- `v == null` — skip (effectively removes the param). Note: `== null` catches both `null` AND `undefined`
- `Array.isArray(v)` — for categoryIds, append each value separately
- `replace: true` — don't create a browser history entry for every filter change

---

## File: `app/pages/LessonPlayer.tsx` — Mutations and Cache Invalidation

### Lines 27-35 — The complete/uncomplete mutations

```tsx
const complete = useMutation({
  mutationFn: () => api.completeLesson(enrollmentId, lessonId),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['enrollment', enrollmentId] })
    qc.invalidateQueries({ queryKey: ['enrollments'] })
  },
})

const uncomplete = useMutation({
  mutationFn: () => api.uncompleteLesson(enrollmentId, lessonId),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['enrollment', enrollmentId] })
    qc.invalidateQueries({ queryKey: ['enrollments'] })
  },
})
```

Both mutations invalidate the SAME two cache keys:
- `['enrollment', enrollmentId]` — the sidebar's lesson list + progress bar on this page
- `['enrollments']` — the "My Learning" dashboard page's enrollment list

When `invalidateQueries` runs, TanStack Query marks those cache entries as "stale" and immediately refetches them in the background. The components watching those keys re-render with the new data. This is how marking a lesson complete updates:
1. The sidebar checkmark (from the enrollment detail query)
2. The progress bar percentage (from the same query — the trigger already updated `enrollments.progress` server-side)
3. The "My Learning" page (if the user navigates there — the enrollments list is already invalidated)

### Lines 78-86 — The Mark Complete / Mark Incomplete toggle

```tsx
{isCompleted ? (
  <button
    disabled={uncomplete.isPending}
    onClick={() => uncomplete.mutate()}
    className="... bg-white text-gray-900 ..."
  >
    <CheckCircle className="w-5 h-5" />
    <span>{uncomplete.isPending ? 'Saving…' : 'Mark as Incomplete'}</span>
  </button>
) : (
  <button
    disabled={complete.isPending}
    onClick={() => complete.mutate()}
    className="... bg-gray-900 text-white ..."
  >
    <CheckCircle className="w-5 h-5" />
    <span>{complete.isPending ? 'Saving…' : 'Mark Complete'}</span>
  </button>
)}
```

The ternary `isCompleted ? ... : ...` renders one of two buttons. Key patterns:
- `disabled={complete.isPending}` — prevents double-clicks while the mutation is in flight
- `complete.isPending ? 'Saving…' : 'Mark Complete'` — button text changes during the request
- Different styling: filled black when not completed (primary action = complete), outlined when completed (secondary action = uncomplete)

---

## File: `app/pages/CourseDetails.tsx` — Enrollment State Machine

### Lines 50-65 — Three queries working together

```tsx
const course = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => api.getCourse(courseId),
})

const enrollments = useQuery({
  queryKey: ['enrollments'],
  queryFn: api.listMyEnrollments,
})

const existingEnrollment = enrollments.data?.find((e) => e.courseId === courseId)

const enrollmentDetail = useQuery({
  queryKey: ['enrollment', existingEnrollment?.id],
  queryFn: () => api.getEnrollment(existingEnrollment!.id),
  enabled: !!existingEnrollment,
})
```

Three queries, each dependent on the previous:

1. **Course detail** — always fetched. Shows the course info regardless of enrollment state.
2. **My enrollments** — always fetched. We need to know if the student is already enrolled.
3. **Enrollment detail** — ONLY fetched if `existingEnrollment` exists (the `enabled` flag). This gives us `myReview` for the review section.

The `enabled: !!existingEnrollment` pattern: `!!` converts any value to boolean. If `existingEnrollment` is `undefined` (not enrolled), `enabled` is `false` and the query never runs. This prevents a fetch to `/api/me/enrollments/undefined`.

### Lines 97-101 — The enrollment state determines the button

```tsx
const isFinished = existingEnrollment && existingEnrollment.progress >= 100

{existingEnrollment ? (
  isFinished ? (
    <div>
      <CheckCircle /> Course Completed
      <button onClick={handleContinue}>Re-open lessons</button>
    </div>
  ) : (
    <button onClick={handleContinue}>
      Continue Learning ({existingEnrollment.progress}%)
    </button>
  )
) : (
  <button onClick={() => enroll.mutate()}>
    Pay & Enroll
  </button>
)}
```

Three states, nested ternaries:
1. **Not enrolled** → "Pay & Enroll" button (triggers the enroll mutation)
2. **Enrolled, in progress** → "Continue Learning (45%)" button (navigates to the lesson player)
3. **Enrolled, finished** → "Course Completed" badge + small "Re-open lessons" link

---

## File: `app/pages/Dashboard.tsx` — Recommendations with Tooltips

### Lines 120-145 — Recommendation cards with (i) icon

```tsx
{recommendations.data.map((course) => (
  <div key={course.id} className="border-2 border-gray-800 bg-white p-4 flex flex-col">
    {/* ... image placeholder, title ... */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
      {showReasons && (
        <div className="relative group flex-shrink-0">
          <Info className="w-4 h-4 text-gray-500 cursor-help mt-1" />
          <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-72 p-3 border-2 border-gray-800 bg-white shadow-lg text-sm text-gray-700 space-y-1">
            <div>{course.reason}</div>
            <div className="border-t border-gray-300 pt-1 mt-1 text-xs text-gray-500 space-y-0.5">
              <div>Confidence: {course.confidence.toFixed(1)}%</div>
              <div>Lift: {course.lift.toFixed(2)}×</div>
              <div>Rating: {course.averageRating.toFixed(1)}★</div>
              <div>Score: {course.score.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
```

**The tooltip pattern using Tailwind `group-hover`:**

1. The outer `div` has `relative group` — `relative` makes it the positioning anchor, `group` marks it as a hover group
2. The `Info` icon is always visible (it's the (i) trigger)
3. The tooltip `div` has `hidden group-hover:block` — hidden by default, shown when the GROUP (not the tooltip itself) is hovered. This means hovering the icon shows the tooltip.
4. `absolute right-0 top-6` — positioned below the icon, right-aligned so it doesn't overflow the card
5. `z-50` — high z-index so it renders above everything else

The `showReasons` flag controls whether the (i) icons appear at all — toggled by the "Show explanations" checkbox.

---

## File: `app/components/DateRangePicker.tsx` — Reusable Date Range

### The useDateRange hook

```tsx
export function useDateRange(defaultDays = 29) {
  const [from, setFrom] = useState(daysAgo(defaultDays))
  const [to, setTo] = useState(todayStr())
  const debouncedFrom = useDebounce(from)
  const debouncedTo = useDebounce(to)

  function onChange(f: string, t: string) {
    setFrom(f)
    setTo(t)
  }

  return { from, to, debouncedFrom, debouncedTo, onChange }
}
```

This hook wraps date range state with debouncing. Two "versions" of each value:
- `from` / `to` — update instantly (the input fields stay responsive)
- `debouncedFrom` / `debouncedTo` — update 500ms after the last change (the API query uses these)

Usage in a page:
```tsx
const range = useDateRange()

// The date picker input binds to range.from/to (instant)
<DateRangePicker from={range.from} to={range.to} onChange={range.onChange} />

// The query uses debounced values (delayed)
const data = useQuery({
  queryKey: ['data', range.debouncedFrom, range.debouncedTo],
  queryFn: () => api.getData(range.debouncedFrom, range.debouncedTo),
})
```

This prevents typing a year from firing 4 API requests (`2`, `20`, `202`, `2026`).

---

## File: `app/components/Pagination.tsx` — Page Number Logic

### Lines 10-22 — The page window calculation

```tsx
const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
if (totalPages <= 1) return null

const from = (page - 1) * pageSize + 1
const to = Math.min(page * pageSize, totalCount)

const windowSize = 5
let start = Math.max(1, page - Math.floor(windowSize / 2))
const end = Math.min(totalPages, start + windowSize - 1)
start = Math.max(1, end - windowSize + 1)

const pages: number[] = []
for (let i = start; i <= end; i++) pages.push(i)
```

- **Line 10:** `totalPages <= 1` → don't render pagination at all if everything fits on one page. `return null` means "render nothing."
- **Lines 12-13:** `from` and `to` for the "Showing 21–40 of 200" text. Page 1 = items 1-20, page 2 = 21-40, etc.
- **Lines 15-19:** The "window" calculation ensures we show at most 5 page buttons, centered around the current page:
  - If you're on page 7 of 20: show `[5, 6, 7, 8, 9]`
  - If you're on page 1 of 20: show `[1, 2, 3, 4, 5]` (can't go below 1)
  - If you're on page 20 of 20: show `[16, 17, 18, 19, 20]` (can't go above totalPages)
- The `start` recalculation on line 19 handles the edge case where `end` was clamped — it shifts the window left to maintain 5 buttons.

---

## File: `lib/useDebounce.ts` — The Debounce Hook

```tsx
export function useDebounce<T>(value: T, delayMs = 500): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
```

**How debouncing works:**
1. `value` changes (e.g., the user types a character in the date input)
2. The effect runs: start a 500ms timer
3. If `value` changes AGAIN before 500ms (user types another character), the cleanup function `clearTimeout(timer)` cancels the pending timer, and a NEW 500ms timer starts
4. After 500ms of no changes, the timer fires and `setDebounced(value)` updates the debounced value
5. The component re-renders with the new debounced value, which triggers the query

Result: the query only fires once, 500ms after the user stops typing.
