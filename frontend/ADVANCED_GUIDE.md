# Frontend — Advanced Guide

This picks up where FRONTEND_GUIDE.md left off. It covers React hooks, performance patterns, TypeScript features, and the non-obvious things happening in our codebase. Read the beginner guide first.

---

## Table of Contents

1. [All the Hooks We Use — What Each Does and Why](#1-all-the-hooks-we-use)
2. [TypeScript — The Type System in Detail](#2-typescript--the-type-system-in-detail)
3. [React Rendering — When and Why Components Re-render](#3-react-rendering--when-and-why-components-re-render)
4. [Advanced Patterns in Our Codebase](#4-advanced-patterns-in-our-codebase)
5. [How React Router Actually Works](#5-how-react-router-actually-works)
6. [The Fetch Lifecycle — What Happens Under the Hood](#6-the-fetch-lifecycle--what-happens-under-the-hood)
7. [Error Handling — Every Level](#7-error-handling--every-level)
8. [Performance — Why Things Are Fast](#8-performance--why-things-are-fast)
9. [Common Pitfalls and How We Avoid Them](#9-common-pitfalls-and-how-we-avoid-them)

---

## 1. All the Hooks We Use

React hooks are functions that start with `use`. They let components "hook into" React features (state, effects, context) and external libraries (routing, queries). Here's every hook in our codebase.

### `useState` — local state

```tsx
const [value, setValue] = useState(initialValue)
```

You already know this from the beginner guide. Two additional things:

**Functional updates** — when the new state depends on the old state:
```tsx
// ❌ Can be stale if called multiple times quickly:
setCount(count + 1)

// ✅ Always uses the latest value:
setCount(prev => prev + 1)
```

We use functional updates in `setForm`:
```tsx
setForm((f) => ({ ...f, title: e.target.value }))
//       ^ f is guaranteed to be the latest form state
```

**Lazy initialization** — when the initial value is expensive to compute:
```tsx
const [value, setValue] = useState(() => computeExpensiveThing())
// The function runs ONCE on first render, not on every re-render.
```

### `useEffect` — side effects after render

```tsx
useEffect(() => {
  // This runs AFTER the component renders to the DOM.
  // It's for things that aren't part of rendering:
  // - fetching data
  // - setting up event listeners
  // - modifying the DOM directly

  return () => {
    // CLEANUP: runs before the next effect or when the component unmounts.
    // Used to remove event listeners, cancel timers, etc.
  }
}, [dep1, dep2])  // Re-run when these values change
```

**The dependency array explained thoroughly:**

```tsx
useEffect(() => { ... }, [])           // Run once on mount. Never again.
useEffect(() => { ... }, [userId])     // Run on mount + every time userId changes.
useEffect(() => { ... }, [a, b])       // Run on mount + when a OR b changes.
useEffect(() => { ... })               // NO ARRAY = run after EVERY render. Rarely wanted.
```

React compares dependencies using `Object.is()` (strict equality). For primitives (numbers, strings, booleans), this is value comparison. For objects and arrays, this is **reference comparison** — `[1,2] !== [1,2]` because they're different objects in memory. This is why we sometimes need `useMemo`.

**Our uses:**

```tsx
// AuthProvider: fetch user on mount
useEffect(() => { api.me().then(setUser)... }, [])

// AuthProvider: listen for auth invalidation events
useEffect(() => {
  window.addEventListener(AUTH_INVALIDATED_EVENT, handler)
  return () => window.removeEventListener(AUTH_INVALIDATED_EVENT, handler)
  // ^ cleanup removes the listener when the component unmounts
}, [])

// Layout: close user menu when clicking outside
useEffect(() => {
  if (!showUserMenu) return  // don't add listener if menu is closed
  const handler = (e) => { ... }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [showUserMenu])  // re-run when menu opens/closes

// CourseEditor: pre-fill form when data loads
useEffect(() => {
  if (course.data) setForm({ title: course.data.title, ... })
}, [course.data?.id])
//  ^ only re-run when a DIFFERENT course loads (not on every re-render)
```

### `useMemo` — memoize an expensive computation

```tsx
const result = useMemo(() => {
  // This function runs only when dependencies change.
  // Its return value is CACHED between renders.
  return expensiveComputation(input)
}, [input])
```

**Why it exists:** React re-renders components often. If a computation is expensive, you don't want to redo it on every render — only when its inputs actually changed.

**Our uses:**

```tsx
// Catalog: build query object from URL params
const query = useMemo(() => ({
  q: q || undefined,
  sort,
  minPrice: minPrice ? Number(minPrice) : undefined,
  ...
}), [searchParams.toString()])
```

Why `useMemo` here? Without it, a NEW object is created on every render. Even if `q`, `sort`, `minPrice` haven't changed, the object itself is a new reference (`{} !== {}`). This would change the TanStack Query key on every render → re-fetch on every render → infinite loop. `useMemo` ensures the same object reference is reused when the inputs haven't changed.

```tsx
// Catalog: build enrollment lookup map
const enrollmentByCourseId = useMemo(() => {
  const map = new Map<number, EnrollmentListItem>()
  for (const e of enrollments.data ?? []) map.set(e.courseId, e)
  return map
}, [enrollments.data])
```

Building a Map from an array is O(n). Not expensive for 10 enrollments, but the `useMemo` also ensures stable identity — the Map reference only changes when `enrollments.data` changes.

```tsx
// AdminOverview: bucket chart data
const chartData = useMemo(() => {
  if (!dashboard.data) return []
  // ... bucketing logic (daily/weekly/monthly) ...
  return buckets
}, [dashboard.data])
```

The bucketing involves loops and math. `useMemo` avoids redoing it on every render (e.g., when the user opens a dropdown or hovers over the chart).

### `useRef` — a mutable container that doesn't cause re-renders

```tsx
const ref = useRef<HTMLDivElement>(null)
```

`useRef` creates a `.current` property that persists across renders. Changing `.current` does NOT cause a re-render. Two uses:

**1. DOM references** — access the actual HTML element:
```tsx
const menuRef = useRef<HTMLDivElement>(null)

// Later, in an effect or handler:
if (menuRef.current && !menuRef.current.contains(e.target)) {
  // click was outside the menu
}

// Attach to the element:
<div ref={menuRef}>...</div>
```

**2. Mutable values** that shouldn't trigger re-renders (we don't use this in our app, but it's common for timers, previous values, etc.).

### `useContext` — read a value from Context

```tsx
const ctx = useContext(AuthContext)
```

Reads the value from the nearest `AuthContext.Provider` ancestor. When the provider's value changes, every component that calls `useContext(AuthContext)` re-renders.

We wrap this in a custom hook for convenience:
```tsx
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// Usage in any component:
const { user, login, logout } = useAuth()
```

### `useParams` — read URL parameters (React Router)

```tsx
// Route: /courses/:id
const { id } = useParams<{ id: string }>()
```

Returns an object with the URL parameters. Types are always `string` — you parse manually if you need a number.

### `useSearchParams` — read/write URL query string (React Router)

```tsx
const [searchParams, setSearchParams] = useSearchParams()

// Read:
const q = searchParams.get('q')              // ?q=react → "react"
const ids = searchParams.getAll('categoryIds') // ?categoryIds=1&categoryIds=2 → ["1", "2"]

// Write:
setSearchParams(new URLSearchParams({ q: 'react', sort: 'newest' }))
```

This is how the Catalog page stores its filter state in the URL. Changing search params updates the URL without a full page reload.

### `useNavigate` — programmatic navigation (React Router)

```tsx
const navigate = useNavigate()

// Navigate to a URL:
navigate('/catalog')

// Navigate with replace (no back button entry):
navigate('/login', { replace: true })

// Go back:
navigate(-1)
```

Used after mutations: `onSuccess: () => navigate(`/learn/${enrollmentId}/${lessonId}`)`.

### `useLocation` — read the current URL (React Router)

```tsx
const location = useLocation()
// location.pathname = "/catalog"
// location.search = "?q=react"
```

Used by Layout to determine which sidebar item is active and whether to show the search bar.

### `useQuery` — fetch and cache data (TanStack Query)

Covered in the beginner guide. Additional details:

```tsx
const data = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => api.getCourse(courseId),
  enabled: Number.isFinite(courseId),  // don't fetch if courseId is NaN
})
```

**`enabled`** — when false, the query is completely disabled. No fetch, no loading state, nothing. We use this for conditional queries:

```tsx
// Only fetch enrollment detail if we know which enrollment
const enrollmentDetail = useQuery({
  queryKey: ['enrollment', existingEnrollment?.id],
  queryFn: () => api.getEnrollment(existingEnrollment!.id),
  enabled: !!existingEnrollment,  // false when not enrolled
})
```

The `!!` converts any value to boolean. `!!undefined` = `false`. `!!{ id: 5 }` = `true`.

### `useMutation` — write data (TanStack Query)

Covered in the beginner guide. Additional detail:

```tsx
const save = useMutation({
  mutationFn: () => api.updateCourse(id, form),
  onSuccess: () => { ... },
  // Also available:
  onError: (error) => { ... },     // runs on failure
  onSettled: () => { ... },         // runs on success OR failure (like finally)
})

// The return object:
save.mutate()          // fire the mutation
save.mutateAsync()     // fire and return a Promise (for await)
save.isPending         // true while in flight
save.isSuccess         // true after success (stays true until reset)
save.error             // the Error if failed
save.reset()           // clear the success/error state
```

We use `save.reset()` in the CourseEditor's `LessonsManager` to clear stale error messages when the lesson list changes.

### `useQueryClient` — access the query cache (TanStack Query)

```tsx
const qc = useQueryClient()

// Invalidate cached data (mark as stale, trigger refetch):
qc.invalidateQueries({ queryKey: ['enrollments'] })

// Invalidate all queries that START with a key:
qc.invalidateQueries({ queryKey: ['course'] })
// This invalidates ['course', 42], ['course', 99], etc.
```

This is how mutations trigger refetches of related data. It's the bridge between "I changed something" and "the UI reflects the change."

---

## 2. TypeScript — The Type System in Detail

### Basic types

```tsx
let count: number = 0
let name: string = 'Bodia'
let active: boolean = true
let items: string[] = ['a', 'b']        // array of strings
let pair: [string, number] = ['age', 25] // tuple (fixed-length, typed positions)
```

### Object types and interfaces

```tsx
type User = {
  id: number
  email: string
  firstName: string
  role: 'Admin' | 'Teacher' | 'Student'  // union type: exactly one of these
}

// Optional properties:
type Filters = {
  q?: string          // string | undefined — may or may not be present
  minPrice?: number
}
```

### Generics — types that take parameters

```tsx
// A generic function:
function first<T>(arr: T[]): T {
  return arr[0]
}
first([1, 2, 3])        // T = number, returns number
first(['a', 'b'])        // T = string, returns string

// A generic type:
type PagedResult<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

// Usage:
PagedResult<CourseListItem>   // { items: CourseListItem[], totalCount: ..., ... }
PagedResult<AdminPayment>     // { items: AdminPayment[], totalCount: ..., ... }
```

Our `request<T>` function uses generics so each API call knows its return type:
```tsx
request<User>('/api/me')                    // returns Promise<User>
request<PagedResult<CourseListItem>>('/api/courses') // returns Promise<PagedResult<CourseListItem>>
request<void>('/api/auth/logout')           // returns Promise<void> (no body)
```

### Union types — "one of these"

```tsx
type Role = 'Admin' | 'Teacher' | 'Student'
// A variable of type Role can ONLY be one of these three strings.
// role = 'Moderator' would be a TypeScript compile error.

type Status = 'Pending' | 'Approved' | 'Rejected' | 'Paid'
```

### The `as` keyword — type assertions

```tsx
const sort = searchParams.get('sort') as SortKey | null
```

`searchParams.get()` returns `string | null`. But we KNOW the string is one of our sort keys. `as SortKey` tells TypeScript "trust me, it's a SortKey." Use sparingly — if you're wrong, TypeScript won't catch it.

### The `!` operator — non-null assertion

```tsx
const id = User.FindFirstValue(ClaimTypes.NameIdentifier)!
//                                                       ^ "I know this is not null"
```

Tells TypeScript "this value is definitely not null/undefined." Use when you have knowledge TypeScript doesn't (e.g., the cookie middleware guarantees this claim exists).

### The `?.` operator — optional chaining

```tsx
const firstLessonId = course.Lessons.FirstOrDefault()?.Id
//                                                   ^ if FirstOrDefault returns null, stop here and return undefined
```

Without `?.`, if `FirstOrDefault()` returned null, accessing `.Id` would crash. With `?.`, it returns `undefined` instead.

### The `??` operator — nullish coalescing

```tsx
const name = user.firstName ?? 'Unknown'
// If firstName is null or undefined → use 'Unknown'
// If firstName is '' (empty string) → use '' (not 'Unknown'!)
// This is different from || which treats '' and 0 as falsy.
```

### Destructuring with types

```tsx
// Object destructuring:
function Login({ onSuccess }: { onSuccess: (user: User) => void }) {
  // onSuccess is a function that takes a User and returns nothing
}

// Array destructuring (from hooks):
const [value, setValue] = useState(0)
//     ^value: number    ^setValue: (v: number) => void
```

### The `Record` type

```tsx
const statusBadge: Record<PayoutStatus, string> = {
  Pending: 'bg-gray-100 text-gray-800',
  Approved: 'bg-gray-300 text-gray-900',
  Paid: 'bg-gray-900 text-white',
  Rejected: 'bg-red-100 text-red-700',
}
```

`Record<K, V>` means "an object where every key is of type K and every value is of type V." TypeScript will error if you miss a status or add an invalid one.

---

## 3. React Rendering — When and Why Components Re-render

### What triggers a re-render

A component re-renders when:
1. Its **state** changes (`setState` is called)
2. Its **parent** re-renders (and passes new props)
3. A **context** it consumes changes (`useContext`)
4. A **TanStack Query** it uses gets new data

### Why this matters

Every re-render re-runs the entire component function. Variables are recreated, functions are recreated, objects are recreated. This is normally fine — React is fast. But it matters for:

**Query keys:** if you create a new object on every render and use it as a query key, TanStack Query thinks the key changed and re-fetches:
```tsx
// ❌ New object every render → infinite refetching
const { data } = useQuery({
  queryKey: ['courses', { q, sort, page }],  // new object each time
  queryFn: () => api.listCourses({ q, sort, page }),
})

// ✅ Memoized object → stable key
const query = useMemo(() => ({ q, sort, page }), [q, sort, page])
const { data } = useQuery({
  queryKey: ['courses', query],
  queryFn: () => api.listCourses(query),
})
```

**Event listeners:** if you add a listener in `useEffect` without proper cleanup, you'll add a new one on every re-render:
```tsx
// ❌ Adds a new listener EVERY render (memory leak)
useEffect(() => {
  window.addEventListener('click', handler)
})

// ✅ Cleanup removes old listener before adding new one
useEffect(() => {
  window.addEventListener('click', handler)
  return () => window.removeEventListener('click', handler)
}, [])
```

---

## 4. Advanced Patterns in Our Codebase

### The "smart banner" pattern (LessonPlayer → CourseDetails)

When a student finishes all lessons, a banner appears linking to the course page with `?review=open`. The course page reads this param and auto-opens the review form:

```tsx
// LessonPlayer: the banner link
<Link to={`/courses/${courseId}?review=open`}>Leave a review →</Link>

// CourseDetails: read the param and auto-open
const [searchParams] = useSearchParams()
useEffect(() => {
  if (searchParams.get('review') === 'open' && enrollmentDetail.data) {
    setShowReviewForm(true)
    setTimeout(() => {
      document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }
}, [searchParams.get('review'), enrollmentDetail.data?.id])
```

The `setTimeout` with 50ms delay is because the form needs one render cycle to appear in the DOM before we can scroll to it.

### The debounce pattern (date range inputs)

```tsx
// useDebounce.ts
export function useDebounce<T>(value: T, delayMs = 500): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
```

**How the timer/cleanup dance works:**

1. User types "2" → `value` changes → effect runs → sets a 500ms timer
2. User types "0" (200ms later) → `value` changes → **cleanup runs** (cancels the 500ms timer) → sets a NEW 500ms timer
3. User types "2" (200ms later) → same thing: cancel old timer, start new timer
4. User types "6" (200ms later) → same thing
5. User stops typing → 500ms passes → timer fires → `setDebounced("2026")` → the query runs

The effect **cleanup function** (`return () => clearTimeout(timer)`) is the key. It runs BEFORE the next effect, canceling the pending timer. Only the LAST timer (after the user stops typing) actually fires.

### The stale-error-reset pattern (CourseEditor lessons)

```tsx
// When lessons change (add/edit/reorder), clear old mutation errors
useEffect(() => {
  deleteLesson.reset()
  reorder.reset()
}, [lessons.map((l) => `${l.id}:${l.orderNumber}:${l.title}:${l.content}`).join('|')])
```

TanStack Query mutations keep their error state until the next mutation call OR until `.reset()`. If a delete fails ("can't delete last lesson"), the error stays visible even after adding a new lesson. This effect resets the errors whenever the lesson list changes.

The dependency is a **fingerprint string** — a hash of all lesson data. When ANY lesson changes (added, removed, reordered, edited), the string changes, the effect fires, and stale errors are cleared.

### The click-outside pattern

```tsx
const menuRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!showMenu) return  // no listener needed when menu is closed

  function handleClickOutside(e: MouseEvent) {
    // menuRef.current is the actual DOM element
    // .contains(e.target) checks if the click was INSIDE the element
    if (menuRef.current && !menuRef.current.contains(e.target as Node))
      setShowMenu(false)
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [showMenu])

// Attach the ref to the element you want to detect clicks outside of:
<div ref={menuRef}>
  {/* menu content */}
</div>
```

Why `mousedown` instead of `click`? `mousedown` fires immediately when the user presses. `click` fires on release — which means if you mousedown on the menu button and mouseup outside, the menu would open and immediately close. `mousedown` avoids this.

### The conditional query pattern

```tsx
const enrollmentDetail = useQuery({
  queryKey: ['enrollment', existingEnrollment?.id],
  queryFn: () => api.getEnrollment(existingEnrollment!.id),
  enabled: !!existingEnrollment,
})
```

`enabled: false` completely disables the query. No fetch, `isPending` stays false, `data` stays undefined. We use this when a query depends on data from ANOTHER query:

1. First, fetch enrollments → find if this student is enrolled
2. If enrolled (`existingEnrollment` exists), THEN fetch the enrollment detail
3. If NOT enrolled, don't fetch (there's nothing to fetch)

Without `enabled`, the query would try to fetch `/api/me/enrollments/undefined` and fail.

### The Tailwind `group-hover` tooltip pattern

```tsx
<div className="relative group">
  <Info className="w-4 h-4 cursor-help" />  {/* always visible */}
  <div className="absolute hidden group-hover:block w-72 p-3 bg-white shadow-lg">
    {/* tooltip content — only visible on hover */}
  </div>
</div>
```

- `group` on the parent marks it as a **hover group**
- `group-hover:block` on the child means "display this when the GROUP is hovered"
- `hidden` is the default state (display: none)
- `absolute` positions the tooltip relative to the nearest `relative` ancestor (the parent div)
- `z-50` ensures it renders above everything else

This is pure CSS — no JavaScript hover state needed.

---

## 5. How React Router Actually Works

### Nested routes and `<Outlet />`

```tsx
{
  path: '/',
  element: <Layout />,     // renders sidebar + header + <Outlet />
  children: [
    { path: 'catalog', element: <Catalog /> },     // renders inside <Outlet />
    { path: 'courses/:id', element: <CourseDetails /> },
  ],
}
```

When the URL is `/catalog`:
1. Router matches `/` → renders `<Layout />`
2. Router matches `catalog` → renders `<Catalog />` inside Layout's `<Outlet />`

When the URL changes to `/courses/42`:
1. Layout stays rendered (sidebar doesn't re-render!)
2. Only the `<Outlet />` content changes to `<CourseDetails />`

This is why navigation feels instant — the shell (sidebar, header) persists.

### `<Link>` vs `<a>` vs `navigate()`

```tsx
// Declarative (in JSX): use <Link>
<Link to="/catalog">Browse courses</Link>

// Programmatic (in code): use navigate()
const nav = useNavigate()
nav('/catalog')
nav('/catalog', { replace: true })   // don't add to history

// Never use: <a href="/catalog"> — this does a full page reload!
```

### The `replace` option

```tsx
navigate('/login', { replace: true })
```

Normal navigation: `current page → /login` (you can press Back to return).
Replace navigation: `previous page ← /login` (Back skips the current page).

We use `replace` for:
- Redirects (HomeRedirect: you don't want Back to go to "/" which redirects again)
- Post-login navigation (you don't want Back to go to the login form)

---

## 6. The Fetch Lifecycle — What Happens Under the Hood

### A complete `useQuery` lifecycle

```
1. Component renders
2. useQuery checks the cache for ['courses', filters]
3. CACHE MISS (first time):
   a. Set isPending = true
   b. Call queryFn → api.listCourses(filters)
   c. api.ts calls fetch() with the cookie
   d. Wait for the HTTP response
   e. Parse JSON
   f. Store in cache with key ['courses', filters]
   g. Set isPending = false, data = result
   h. Component re-renders with the data

4. CACHE HIT (same key requested again):
   a. Return cached data immediately (isPending = false, data = cached)
   b. Optionally refetch in the background if stale

5. CACHE INVALIDATED (mutation called invalidateQueries):
   a. Mark the cache entry as stale
   b. If a component is currently mounted with this key, refetch immediately
   c. When new data arrives, update cache + re-render
```

### A complete `useMutation` lifecycle

```
1. User clicks button → calls mutation.mutate()
2. Set isPending = true
3. Call mutationFn → api.enroll(courseId)
4. api.ts calls fetch() with method: 'POST'
5. Wait for the HTTP response
6. SUCCESS:
   a. Set isPending = false, isSuccess = true, data = result
   b. Call onSuccess callback
   c. onSuccess calls invalidateQueries → related queries refetch
   d. Component re-renders (button text changes, etc.)
7. FAILURE:
   a. Set isPending = false, error = the Error
   b. Call onError callback (if defined)
   c. Component re-renders (error message appears)
```

---

## 7. Error Handling — Every Level

### Level 1: API client (`api.ts`)

```tsx
if (!res.ok) {
  // Try to parse error body: { error: "message" } or { errors: ["msg1", "msg2"] }
  // Fall back to "HTTP 401" if no body
  throw new Error(message)
}
```

Every failed request becomes a thrown Error with a human-readable message extracted from the backend's JSON response.

### Level 2: TanStack Query

```tsx
// Queries: error state
{data.error && <div className="error">{data.error.message}</div>}

// Mutations: error state
{save.error && <p>{save.error.message}</p>}
```

TanStack Query catches the thrown Error and stores it in `.error`. Components render error messages conditionally.

### Level 3: Auth recovery

```tsx
if (res.status === 401 || res.status === 403) {
  window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT))
}
```

401/403 errors trigger the cross-tab recovery mechanism. The user gets redirected to login if their session is invalid.

### Level 4: Form validation

```tsx
if (req.Password.Length < 6)
  return BadRequest(new { error = "Password must be at least 6 characters." });
```

The backend validates and returns structured error messages. The frontend displays them under the form field.

---

## 8. Performance — Why Things Are Fast

### TanStack Query caching

Navigate from Catalog → Course Detail → Back to Catalog. The catalog data appears **instantly** because it's still in cache. No loading spinner, no network request (unless the cache is stale).

### `useMemo` prevents unnecessary re-fetches

The catalog query object is memoized. Without `useMemo`, every render creates a new object → new query key → unnecessary refetch.

### Debounced inputs

Date range inputs are debounced (500ms). Typing a year doesn't fire 4 API requests.

### `table-fixed` prevents layout reflow

HTML tables with `table-fixed` don't recalculate column widths when data changes. The browser lays out columns once based on the header widths.

### Pinned sidebar and header

The layout uses `h-screen overflow-hidden` on the outer div and `overflow-auto` on the main content. Only the page content scrolls — the sidebar and header never need to be re-painted during scroll.

---

## 9. Common Pitfalls and How We Avoid Them

### Pitfall: Objects in dependency arrays

```tsx
// ❌ New object every render → effect runs every render
useEffect(() => { ... }, [{ q, sort }])

// ✅ Primitive values → effect runs only when values change
useEffect(() => { ... }, [q, sort])
```

### Pitfall: Async in useEffect

```tsx
// ❌ useEffect can't be async (React ignores the returned Promise)
useEffect(async () => { ... }, [])

// ✅ Define async function inside, then call it
useEffect(() => {
  async function load() { ... }
  load()
}, [])

// ✅ Or use .then() chains (what we do)
useEffect(() => {
  api.me().then(setUser).catch(() => setUser(null))
}, [])
```

### Pitfall: Stale closures

```tsx
// ❌ count is captured at the time the effect runs
useEffect(() => {
  setInterval(() => console.log(count), 1000)  // always logs the initial count
}, [])

// ✅ Use a ref for values that change but shouldn't trigger the effect
const countRef = useRef(count)
countRef.current = count
useEffect(() => {
  setInterval(() => console.log(countRef.current), 1000)
}, [])
```

We don't have this specific issue, but the debounce hook avoids a similar pitfall by using cleanup functions to cancel stale timers.

### Pitfall: Missing cleanup

```tsx
// ❌ Memory leak: listener accumulates on every re-render
useEffect(() => {
  window.addEventListener('resize', handler)
}, [])

// ✅ Cleanup removes the old listener
useEffect(() => {
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

Every `addEventListener` in an effect should have a matching `removeEventListener` in the cleanup.

### Pitfall: Rendering during mutation

```tsx
// ❌ Calling setState during render → infinite loop
function Bad() {
  const [x, setX] = useState(0)
  setX(1)  // this runs during render → triggers another render → setX(1) → ...
  return <div>{x}</div>
}

// ✅ State updates go in event handlers or effects, never at the top level of the render
function Good() {
  const [x, setX] = useState(0)
  return <button onClick={() => setX(1)}>Click</button>
}
```
