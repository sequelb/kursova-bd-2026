# Frontend — How Everything Works

This document explains the frontend codebase at the implementation level. Written for someone who wants to genuinely understand how things work.

---

## Table of Contents

1. [TypeScript / React Patterns You'll See Everywhere](#1-typescript--react-patterns-youll-see-everywhere)
2. [How the App Boots](#2-how-the-app-boots)
3. [Routing — How Pages Are Loaded](#3-routing--how-pages-are-loaded)
4. [Authentication — AuthProvider and RequireAuth](#4-authentication--authprovider-and-requireauth)
5. [Data Fetching — TanStack Query](#5-data-fetching--tanstack-query)
6. [The API Client — lib/api.ts](#6-the-api-client--libapits)
7. [Layout — Sidebar, Header, Main Content](#7-layout--sidebar-header-main-content)
8. [Component Patterns — How Pages Are Built](#8-component-patterns--how-pages-are-built)
9. [Styling — Tailwind CSS](#9-styling--tailwind-css)
10. [Reusable Components We Built](#10-reusable-components-we-built)
11. [State Management — What Lives Where](#11-state-management--what-lives-where)
12. [Page-by-Page Overview](#12-page-by-page-overview)

---

## 1. TypeScript / React Patterns You'll See Everywhere

### Typed props

```tsx
type Props = {
  categories: Category[]
  selected: number[]
  onChange: (ids: number[]) => void
}

export function CategoryMultiSelect({ categories, selected, onChange }: Props) {
```

Every component declares its `Props` type. TypeScript checks at build time that you're passing the right data. If you pass `selected="hello"` instead of `selected={[1,2]}`, the build fails.

The `{ categories, selected, onChange }` syntax is **destructuring** — it extracts the named properties from the props object so you can use them directly (instead of `props.categories`).

### useState — local component state

```tsx
const [email, setEmail] = useState('admin@local')
```

`useState` returns a pair: the current value and a function to update it. When you call `setEmail('new@email.com')`, React re-renders the component with the new value. The argument to `useState` is the initial value (only used on first render).

State is **local** to the component instance. Two `<Login />` components on the same page would have independent `email` state.

### useEffect — side effects

```tsx
useEffect(() => {
  api.me().then(setUser).catch(() => setUser(null))
}, [])
```

`useEffect` runs code **after** the component renders. The `[]` dependency array means "run once, on first render only." If you put `[searchTerm]`, it re-runs every time `searchTerm` changes.

Common uses in our app:
- Fetch data on mount (the `[]` pattern)
- Listen for events (`addEventListener` in the effect, `removeEventListener` in the cleanup)
- Sync state when props change

### useQuery / useMutation — TanStack Query hooks

These are covered in detail in [section 5](#5-data-fetching--tanstack-query).

### Conditional rendering

```tsx
{courses.isPending && <p>Loading…</p>}
{courses.error && <p>Failed: {error.message}</p>}
{courses.data && <CourseGrid courses={courses.data} />}
```

In JSX, `{condition && <Component />}` renders the component only if the condition is truthy. This replaces if/else for rendering different states.

### map — rendering lists

```tsx
{courses.data.items.map((course) => (
  <div key={course.id}>
    <h3>{course.title}</h3>
  </div>
))}
```

`.map()` transforms an array of data into an array of JSX elements. The `key={course.id}` prop tells React how to track each element for efficient updates — without it, React can't tell which item changed when the list updates.

### Event handlers

```tsx
<button onClick={() => setShowFilters(!showFilters)}>
<form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
<input onChange={(e) => setEmail(e.target.value)} />
```

- `onClick` — runs when the element is clicked
- `onSubmit` — runs when a form is submitted. `e.preventDefault()` stops the browser from doing a full page reload (the default form behavior).
- `onChange` — runs on every keystroke in an input. `e.target.value` is the current input text.

### Type assertions and the `as` keyword

```tsx
catch (e) {
  setError((e as Error).message)
}
```

TypeScript doesn't know that a caught exception is an `Error` (it could be anything). `as Error` tells TypeScript "I know this is an Error, trust me." We use this in catch blocks throughout the app.

---

## 2. How the App Boots

### Entry point: `main.tsx`

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

React takes over the `#root` DOM element and renders our `<App />` component into it. The `!` tells TypeScript "this element definitely exists."

### App.tsx — The provider chain

```tsx
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

Three nested providers, each adding a capability:

1. **QueryClientProvider** — makes TanStack Query available to all components. Any component can call `useQuery()` to fetch data.
2. **AuthProvider** — fetches the current user on mount (`GET /api/me`). Makes `useAuth()` available — any component can read the current user or call login/logout.
3. **RouterProvider** — loads the route configuration and renders the matching page.

**Order matters.** Auth needs to be inside Query (because `AuthProvider` might want to use queries in the future). Router needs to be inside Auth (because routes check `useAuth()` for access control).

### The QueryClient configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
})
```

- `retry: false` — don't auto-retry failed requests. Default is 3 retries, which causes confusing delays when the server is down.
- `refetchOnWindowFocus: false` — don't re-fetch data when the user switches browser tabs. Default behavior is to refetch, which causes unexpected loading states.

---

## 3. Routing — How Pages Are Loaded

### routes.ts structure

```tsx
export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    path: '/',
    element: createElement(RequireAuth, null, createElement(Layout)),
    children: [
      { index: true, Component: HomeRedirect },
      { path: 'my-learning', element: studentOnly(createElement(Dashboard)) },
      { path: 'catalog', element: studentOnly(createElement(Catalog)) },
      { path: 'courses/:id', element: studentOnly(createElement(CourseDetails)) },
      // ... teacher routes, admin routes
    ],
  },
])
```

**How routing works:**
1. The browser URL is `http://localhost:5173/courses/42`
2. React Router matches `/courses/:id` where `:id` = `42`
3. It renders: `RequireAuth → Layout → RequireAuth(Student) → CourseDetails`
4. `CourseDetails` reads the `42` via `useParams()`

**Nested routes:** The root `/` route renders `Layout` (sidebar + header). Its `children` render inside `Layout`'s `<Outlet />` — the "page content" area. This is how every page gets the same sidebar without duplicating it.

### Public vs protected routes

- `/login` and `/register` have no `RequireAuth` wrapper — anyone can access them
- Everything under `/` is wrapped in `RequireAuth` — redirects to `/login` if not authenticated
- Each child route is additionally wrapped in role-specific guards: `studentOnly()`, `teacherOnly()`, `adminOnly()`

### HomeRedirect — role-based landing page

```tsx
export function HomeRedirect() {
  const { user } = useAuth()
  switch (user.role) {
    case 'Student': return <Navigate to="/my-learning" replace />
    case 'Teacher': return <Navigate to="/teacher/courses" replace />
    case 'Admin':   return <Navigate to="/admin/overview" replace />
  }
}
```

When you visit `/`, this component instantly redirects to the right home page for your role. `replace` means it replaces the history entry — pressing "back" won't take you to `/` again (which would redirect you again in a loop).

### Route parameters

```tsx
// In routes.ts:
{ path: 'courses/:id', Component: CourseDetails }

// In CourseDetails:
const { id } = useParams<{ id: string }>()
const courseId = Number(id)
```

`:id` in the route path is a **parameter**. `useParams()` extracts it. Parameters are always strings — we parse to number explicitly.

---

## 4. Authentication — AuthProvider and RequireAuth

### AuthProvider (lib/auth.tsx)

```tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])
```

On mount, it calls `GET /api/me`. Three outcomes:
- **Success:** server returns the user → `setUser(user)` → the user is "logged in"
- **401:** no cookie or invalid cookie → `setUser(null)` → the user is "logged out"
- **Either way:** `setLoading(false)` → stop showing "Loading..."

The user state lives here and is shared via React Context. Every component in the app can call `useAuth()` to get `{ user, loading, login, logout }`.

### Cross-tab cookie swap recovery

```tsx
useEffect(() => {
  const handler = () => {
    api.me().then(setUser).catch(() => setUser(null))
  }
  window.addEventListener(AUTH_INVALIDATED_EVENT, handler)
  return () => window.removeEventListener(AUTH_INVALIDATED_EVENT, handler)
}, [])
```

If the user opens a second tab and logs in as a different user, the cookie is replaced (cookies are shared across tabs). The first tab's React state still thinks it's the old user, but every API call will fail with 401/403.

When `api.ts` gets a 401/403, it dispatches a custom DOM event. This effect listens for it and re-fetches `/api/me`, which updates the user state and triggers a re-render across the app.

### RequireAuth component

```tsx
export function RequireAuth({ children, roles }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <div>No access</div>

  return <>{children}</>
}
```

Three checks in order:
1. Still loading (waiting for `/api/me` response) → show loading
2. Not logged in → redirect to login page
3. Logged in but wrong role → show "no access"
4. All good → render the children (the protected page)

---

## 5. Data Fetching — TanStack Query

### The mental model

TanStack Query manages **server state** — data that lives on the backend. It's NOT a state management library for local UI state (use `useState` for that).

Two core concepts:
- **Queries** = reading data (GET requests)
- **Mutations** = changing data (POST/PUT/DELETE requests)

### useQuery — reading data

```tsx
const courses = useQuery({
  queryKey: ['courses', filters],
  queryFn: () => api.listCourses(filters),
})
```

- `queryKey` identifies this piece of data. If two components use the same key, they share the same cache entry (one fetch, both get the data).
- `queryFn` is the function that actually fetches. It's only called when the cache is empty or stale.

The return object has:
- `courses.data` — the fetched data (undefined until loaded)
- `courses.isPending` — true while loading
- `courses.error` — the error if the fetch failed
- `courses.isSuccess` — true if data is loaded

**The key insight:** when `filters` changes, the `queryKey` changes, so TanStack Query treats it as a different piece of data and re-fetches. Old data is cached — if you switch back to the old filters, the data appears instantly.

### useMutation — writing data

```tsx
const enroll = useMutation({
  mutationFn: () => api.enroll(courseId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    queryClient.invalidateQueries({ queryKey: ['course', courseId] })
  },
})

// Triggered by:
<button onClick={() => enroll.mutate()}>Enroll</button>
```

- `mutationFn` runs when you call `enroll.mutate()`
- `onSuccess` runs after a successful mutation — this is where you **invalidate** related queries

**Cache invalidation** is the key pattern. After enrolling in a course:
- We invalidate `['enrollments']` → the "My Learning" page refetches (the new enrollment appears)
- We invalidate `['course', courseId]` → the course detail page refetches (enrollment count updates)

Without invalidation, the UI would show stale data until the user manually refreshes.

### Query keys — the naming convention

```
['courses']                       — the course catalog
['courses', { q: 'react', ... }]  — filtered catalog
['course', 42]                    — single course detail
['enrollments']                   — my enrollments list
['enrollment', 12]                — single enrollment detail
['lesson', 12, 55]                — lesson content within enrollment
['admin-payments', status, q, page] — admin payments page
['recommendations']               — my recommendations
```

The convention: most general noun first, then identifiers, then filters. When you invalidate `['enrollments']`, ALL queries whose key starts with `['enrollments']` are invalidated — including `['enrollment', 12]`.

---

## 6. The API Client — lib/api.ts

### The request function

```tsx
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })
```

Every API call goes through this function. It:
1. Prepends the base URL (`http://localhost:5000`)
2. Sets `credentials: 'include'` — tells the browser to send the `lp.auth` cookie
3. Sets `Content-Type: application/json` — tells the server the body is JSON
4. On error, extracts the error message from the JSON response body
5. On 401/403, dispatches the `AUTH_INVALIDATED_EVENT` for cross-tab recovery

### The api object

```tsx
export const api = {
  login: (body) => request<User>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  listCourses: (q) => request<PagedResult<CourseListItem>>('/api/courses' + buildQuery(q)),
  enroll: (courseId) => request<EnrollResult>(`/api/courses/${courseId}/enroll`, { method: 'POST' }),
  // ... ~40 methods total
}
```

This is the ONLY file that knows the URL shape of the backend. If the backend renames an endpoint, you change ONE line here. All components call `api.listCourses()`, not `fetch('/api/courses')`.

### TypeScript types

```tsx
export type CourseListItem = {
  id: number
  title: string
  price: number
  // ...
}
```

These types mirror the backend's DTOs. TypeScript checks at build time that you're accessing valid properties — `course.titel` (typo) would be a compile error.

---

## 7. Layout — Sidebar, Header, Main Content

### The viewport-height layout

```tsx
<div className="h-screen flex bg-white overflow-hidden">
  <aside className="w-64 ... overflow-y-auto">
    {/* sidebar nav */}
  </aside>
  <div className="flex-1 flex flex-col">
    <header>
      {/* search bar + user menu */}
    </header>
    <main className="flex-1 overflow-auto bg-gray-50">
      <Outlet />
    </main>
  </div>
</div>
```

- `h-screen` — the outer div fills the entire viewport height
- `overflow-hidden` — the outer div itself never scrolls
- `overflow-y-auto` on the aside — the sidebar scrolls independently if its content is taller than the viewport
- `overflow-auto` on main — the page content scrolls independently
- `<Outlet />` — react-router renders the matched child route here

The result: sidebar stays pinned, header stays pinned, only the page content scrolls.

### Role-dependent sidebar

```tsx
const navItems = user.role === 'Student' ? studentNavItems
               : user.role === 'Teacher' ? teacherNavItems
               : adminNavItems
```

Three hardcoded arrays of `{ path, label, icon }`. The sidebar renders whichever array matches the user's role. The portal title also changes ("Student Portal" / "Teacher Portal" / "Admin Portal").

### Click-outside to close the user menu

```tsx
const userMenuRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  if (!showUserMenu) return
  function handleClickOutside(e: MouseEvent) {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
      setShowUserMenu(false)
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [showUserMenu])
```

`useRef` creates a reference to the DOM element. When a click happens anywhere on the page, we check if the click target is inside the menu (`contains`). If not, close the menu.

The `return () => removeEventListener(...)` is a **cleanup function** — React runs it when the effect re-runs or the component unmounts. Without cleanup, we'd add a new event listener every time the menu opens.

---

## 8. Component Patterns — How Pages Are Built

### The standard page pattern

Almost every page follows this structure:

```tsx
export function SomePage() {
  // 1. Get route params (if any)
  const { id } = useParams()

  // 2. Fetch data
  const data = useQuery({ queryKey: [...], queryFn: ... })

  // 3. Handle loading / error
  if (data.isPending) return <div>Loading…</div>
  if (data.error) return <div>Error: {data.error.message}</div>

  // 4. Render the UI
  return (
    <div className="p-8">
      <h1>{data.data.title}</h1>
      {/* ... */}
    </div>
  )
}
```

### Forms with mutations

```tsx
const [form, setForm] = useState({ title: '', price: 0 })

const save = useMutation({
  mutationFn: () => api.updateCourse(id, form),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['teacher-course', id] })
    setDirty(false)
  },
})

<input value={form.title} onChange={(e) => { setForm({...form, title: e.target.value}); setDirty(true) }} />
<button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>Save</button>
{save.isSuccess && !dirty && <span>✓ Saved</span>}
```

Pattern:
1. Form state in `useState`
2. `dirty` flag tracks if anything changed
3. Save button triggers `save.mutate()`
4. On success, invalidate the cached data (so re-fetching shows the saved values)
5. "✓ Saved" indicator shows when `save succeeded AND nothing is dirty`

### URL-driven state (Catalog filters)

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const q = searchParams.get('q') ?? ''
const sort = searchParams.get('sort') ?? 'newest'
const page = Number(searchParams.get('page') ?? '1')
```

The catalog filters live in the **URL search params** (`?q=react&sort=price_asc&page=2`). This means:
- Refreshing the page preserves the filters
- Sharing the URL shares the filter state
- The browser's back/forward buttons work with filter changes

`setSearchParams` updates the URL without a full page reload.

---

## 9. Styling — Tailwind CSS

### How Tailwind works

Instead of writing CSS files, you put utility classes directly on elements:

```tsx
<div className="p-8 mb-6 border-2 border-gray-800 bg-white text-gray-900 font-bold">
```

Each class does ONE thing:
- `p-8` → padding: 2rem (32px) on all sides
- `mb-6` → margin-bottom: 1.5rem
- `border-2` → border-width: 2px
- `border-gray-800` → border-color: a dark gray
- `bg-white` → background-color: white
- `text-gray-900` → color: near-black
- `font-bold` → font-weight: 700

### Responsive and state modifiers

```tsx
<button className="bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors">
```

- `hover:bg-gray-700` → changes background on mouse hover
- `disabled:opacity-50` → makes the button semi-transparent when `disabled` attribute is set
- `transition-colors` → animates color changes smoothly

### The design system

Our app uses a consistent visual language:
- **Borders:** `border-2 border-gray-800` for primary elements, `border-gray-400` for secondary
- **Backgrounds:** `bg-white` for cards, `bg-gray-100` for headers/sidebars, `bg-gray-50` for page background, `bg-gray-900` for primary buttons
- **Text:** `text-gray-900` for primary, `text-gray-700` for secondary, `text-gray-600` for muted
- **Spacing:** `p-4` for compact, `p-6` for cards, `p-8` for page padding
- **Buttons:** filled (`bg-gray-900 text-white`) for primary, outlined (`bg-white border-gray-800`) for secondary

---

## 10. Reusable Components We Built

### Pagination

```tsx
<Pagination
  page={page}
  pageSize={20}
  totalCount={data.totalCount}
  onPageChange={(p) => setPage(p)}
/>
```

Renders "Showing X–Y of Z" + page number buttons + prev/next. Shows at most 5 page buttons centered around the current page, with ellipsis + first/last for long page lists. Hides entirely if there's only 1 page.

### RequireAuth

Wraps protected routes. Handles loading state, redirect to login, and role checking.

### HomeRedirect

Redirects `/` to the right home page based on user role.

### DateRangePicker + useDateRange

```tsx
const range = useDateRange()  // state + debounce
<DateRangePicker from={range.from} to={range.to} onChange={range.onChange} />
// Use range.debouncedFrom/debouncedTo in queries
```

Two date inputs + preset buttons (7d/30d/90d/1y). The `useDateRange` hook wraps the state with debouncing — inputs update instantly (responsive typing), but the query-driving values only update after 500ms of inactivity.

### CategoryMultiSelect

```tsx
<CategoryMultiSelect
  categories={categories}
  selected={selectedIds}
  onChange={(ids) => ...}
/>
```

A searchable dropdown built on cmdk + Radix Popover. Click to open, type to filter, click categories to toggle (with checkboxes). Selected items shown as removable chips inside the input.

---

## 11. State Management — What Lives Where

### No global state library

We don't use Redux, Zustand, or any state management library. State lives in three places:

1. **Server state** → TanStack Query cache. Courses, enrollments, payments — anything from the API.
2. **Auth state** → React Context (`AuthProvider`). Current user, login/logout functions.
3. **Local UI state** → `useState` in each component. Form inputs, filter values, open/closed toggles.

This works because:
- TanStack Query handles 90% of what Redux would do (caching, refetching, loading states)
- Auth is the only truly global client state, and Context handles it fine
- Everything else is local to the page that needs it

### URL state for shareability

Some state lives in the URL instead of `useState`:
- **Catalog filters** → search params (`?q=react&sort=price_asc&page=2`)
- **Course/enrollment IDs** → route params (`/courses/42`, `/learn/12/55`)

This makes the app bookmarkable and shareable — copy the URL, paste it, see the same page.

---

## 12. Page-by-Page Overview

### Student pages

**Dashboard** (`/my-learning`) — two sections: "My Learning Progress" (enrolled courses with progress bars) and "Recommended Courses" (from the association rules algorithm). Recommendations have an (i) tooltip showing confidence, lift, rating, and score.

**Catalog** (`/catalog`) — course grid with URL-driven filters (search, categories, price range, rating, sort, pagination). Cards show an "Enrolled · N%" badge for already-enrolled courses.

**CourseDetails** (`/courses/:id`) — course info + curriculum + reviews. Right-side card shows "Pay & Enroll" / "Continue Learning" / "Course Completed" depending on enrollment state. "Your Review" section with edit (pencil icon) and delete (trash icon).

**LessonPlayer** (`/learn/:enrollmentId/:lessonId`) — lesson content on the left, course outline on the right (with completed/current/incomplete icons). Mark complete / mark incomplete button. Navigation prev/next. Smart banner linking to course page for review when all lessons done.

**Author** (`/authors/:id`) — public teacher profile with bio + their published courses.

### Teacher pages

**TeacherDashboard** (`/teacher/courses`) — grid of own courses with status badges, rating, enrollment count. "Create New Course" navigates to the editor.

**CourseEditor** (`/teacher/courses/new` and `/teacher/courses/:id/edit`) — course details form + lesson manager (add/edit/delete/reorder with up-down arrows). Publish/Unpublish buttons. Delete course at the bottom.

**CourseAnalytics** (`/teacher/courses/:id/analytics`) — KPI cards + enrollment timeline chart with date range picker.

**StudentReviews** (`/teacher/reviews`) — paginated reviews list with course filter dropdown.

**Earnings** (`/teacher/earnings`) — balance card (red when negative) + request payout form + payout history table.

**TeacherProfile** (`/teacher/profile`) — bio editor with "✓ Saved" indicator.

### Admin pages

**AdminOverview** (`/admin/overview`) — KPI cards + revenue vs payouts chart with date range picker + alerts panel.

**FinancialControls** (`/admin/payments`) — paginated payments table with status filter + search + refund button.

**TeacherPayouts** (`/admin/payouts`) — paginated payouts table with status filter + search + approve/reject/mark-paid buttons.

**UserManagement** (`/admin/users`) — paginated users table with role/status filters + search + suspend/activate toggle.
