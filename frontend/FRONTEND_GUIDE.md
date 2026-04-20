# Frontend — A Complete Guide

This guide walks you through the entire frontend from the ground up. Read it top to bottom — each section builds on the previous one. By the end you'll understand how every piece fits together.

---

## Part 1: The Basics — What Even Is React?

### The core idea

A React app is a tree of **components**. A component is a function that takes some input (props) and returns what should appear on screen (JSX). When the input changes, React automatically updates the screen.

```tsx
// This is a component. It's just a function.
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// Usage:
<Greeting name="Bodia" />
// Renders: <h1>Hello, Bodia!</h1>
```

The `<h1>Hello, {name}!</h1>` syntax is **JSX** — it looks like HTML but it's actually JavaScript. The `{name}` inserts the variable's value. JSX gets compiled to regular function calls at build time.

### Components render, re-render, and re-render again

React calls your component function **every time something changes**. If you click a button that updates a counter, React calls the entire component function again, gets the new JSX, and updates only the parts of the DOM that actually changed.

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  // This entire function runs EVERY TIME count changes.
  // React compares the old and new output and updates the DOM.
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}
```

This is the mental model: **your component is a pure function from state to UI**. State changes → function re-runs → UI updates.

### Props vs State

**Props** = input from the parent component. Read-only. The component can't change its own props.

```tsx
// Parent passes data down via props:
<CourseCard id={1} title="React Basics" price={49.99} averageRating={4.5} reviewCount={12} createdAt="2026-01-01" />

// Child receives them:
function CourseCard({ id, title, price, ... }: CourseCardProps) {
  return <div>{title} — ${price}</div>
}
```

**State** = data the component owns and can change. When state changes, the component re-renders.

```tsx
function Toggle() {
  const [isOpen, setIsOpen] = useState(false)
  //     ^value    ^setter       ^initial value

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <p>I am visible!</p>}
    </div>
  )
}
```

`useState(false)` creates a piece of state initialized to `false`. It returns the current value and a function to update it. When you call `setIsOpen(true)`, React re-renders the component with `isOpen = true`.

### useEffect — doing things after render

Sometimes you need to DO something (fetch data, add event listeners) rather than just RENDER something. That's what `useEffect` is for.

```tsx
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // This runs AFTER the component renders.
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [userId])
  //  ^^^^^^^^ dependency array: re-run this effect when userId changes

  if (!user) return <p>Loading...</p>
  return <p>{user.name}</p>
}
```

The **dependency array** `[userId]` controls when the effect re-runs:
- `[]` (empty) → run once after first render, never again
- `[userId]` → run after first render AND every time `userId` changes
- no array at all → run after EVERY render (almost never what you want)

### Context — sharing data without passing props

If many components need the same data (like "who is the current user?"), passing it through every component as props is tedious. **Context** solves this.

```tsx
// 1. Create a context
const ThemeContext = createContext('light')

// 2. Provide a value at a high level
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />    {/* everything inside can read the theme */}
    </ThemeContext.Provider>
  )
}

// 3. Read the value from any nested component
function Button() {
  const theme = useContext(ThemeContext) // "dark"
  return <button className={theme === 'dark' ? 'bg-black' : 'bg-white'}>Click</button>
}
```

In our app, we use Context for one thing: **authentication**. The `AuthProvider` at the top of the tree provides `{ user, login, logout }` and any component can call `useAuth()` to access it.

---

## Part 2: How Our App Is Structured

### The file tree (what matters)

```
frontend/src/
├── main.tsx                    ← entry point (1 line, renders <App />)
├── lib/
│   ├── api.ts                 ← ALL network calls (the only file that knows URLs)
│   ├── auth.tsx               ← AuthProvider + useAuth hook
│   └── useDebounce.ts         ← utility hook for delayed updates
└── app/
    ├── App.tsx                ← wraps everything in providers
    ├── routes.ts              ← which URL → which page
    ├── components/
    │   ├── Layout.tsx         ← sidebar + header (shared chrome)
    │   ├── RequireAuth.tsx    ← gate: redirect if not logged in
    │   ├── HomeRedirect.tsx   ← redirect / based on role
    │   ├── CourseCard.tsx      ← shared course card (Catalog, Dashboard, Author)
    │   ├── QueryError.tsx     ← error display (404 → NotFound page, else banner)
    │   ├── Pagination.tsx     ← reusable page navigation
    │   ├── DateRangePicker.tsx← reusable date range inputs
    │   └── CategoryMultiSelect.tsx ← searchable category dropdown
    └── pages/
        ├── Login.tsx, Register.tsx
        ├── Dashboard.tsx      ← student "My Learning"
        ├── Catalog.tsx        ← student course catalog
        ├── CourseDetails.tsx   ← student course detail
        ├── LessonPlayer.tsx   ← student lesson viewer
        ├── Author.tsx         ← public author profile
        ├── NotFound.tsx       ← generic 404 page (also catch-all route)
        ├── teacher/           ← 6 teacher pages
        └── admin/             ← 4 admin pages
```

### How they connect

Think of it as layers:

```
Layer 1: App.tsx
  └─ Providers (QueryClient, Auth, Router)

Layer 2: routes.ts
  └─ RequireAuth → Layout
       └─ Pages (Dashboard, Catalog, etc.)

Layer 3: Each page
  └─ useQuery/useMutation (fetch data)
       └─ api.ts (make the actual HTTP request)
            └─ Backend API (http://localhost:5000)
```

Every user action flows DOWN through these layers:
1. User clicks "Enroll" on CourseDetails
2. CourseDetails calls `enroll.mutate()` (TanStack Query mutation)
3. The mutation calls `api.enroll(courseId)` (our API client)
4. `api.ts` calls `fetch('http://localhost:5000/api/courses/42/enroll', { method: 'POST' })`
5. Backend processes it, returns `{ enrollmentId, firstLessonId }`
6. TanStack Query's `onSuccess` runs: invalidates the enrollments cache
7. React re-renders components that depend on that cache
8. User sees the updated UI

---

## Part 3: The Boot Sequence — What Happens When You Open the App

### Step 1: `main.tsx` renders `<App />`

```tsx
createRoot(document.getElementById("root")!).render(<App />)
```

This takes the `#root` div in `index.html` and gives it to React. From now on, React controls everything inside it.

### Step 2: `App.tsx` sets up three providers

```tsx
<QueryClientProvider client={queryClient}>   {/* makes useQuery/useMutation work */}
  <AuthProvider>                              {/* fetches current user */}
    <RouterProvider router={router} />        {/* renders the right page */}
  </AuthProvider>
</QueryClientProvider>
```

These are **nested wrappers**. Each adds a capability that all components inside it can use:
- `QueryClientProvider` → any component can call `useQuery()` to fetch data
- `AuthProvider` → any component can call `useAuth()` to get the current user
- `RouterProvider` → renders whichever page matches the current URL

### Step 3: `AuthProvider` checks if you're already logged in

```tsx
useEffect(() => {
  api.me()                        // GET /api/me (sends the cookie)
    .then(setUser)                // success → store the user
    .catch(() => setUser(null))   // 401 → no user (not logged in)
    .finally(() => setLoading(false))
}, [])
```

This runs ONCE on app startup. If the browser has a valid `lp.auth` cookie from a previous session, the server returns the user info and you're "logged in" without having to type your password again.

### Step 4: `RequireAuth` decides what to show

While `AuthProvider` is loading (waiting for `/api/me`), `RequireAuth` shows "Loading...". After the response:
- If `user` is null → redirect to `/login`
- If `user` exists but wrong role → show "no access"
- If `user` exists and correct role → render the page

### Step 5: `Layout` renders the chrome, `<Outlet />` renders the page

`Layout` is the **persistent shell** — the sidebar and header that appear on every page. The actual page content renders where `<Outlet />` is:

```tsx
<div className="h-screen flex">
  <aside> {/* sidebar with nav links */} </aside>
  <div>
    <header> {/* search bar + user menu */} </header>
    <main>
      <Outlet />  {/* ← THE CURRENT PAGE RENDERS HERE */}
    </main>
  </div>
</div>
```

When you click a sidebar link (e.g., "Catalog"), React Router swaps the component inside `<Outlet />` without re-rendering the sidebar or header. That's why navigation feels instant — only the page content changes.

---

## Part 4: Data Fetching — TanStack Query

### The problem it solves

Without TanStack Query, every page would need:
```tsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  api.getCourse(id)
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [id])
```

That's 10 lines of boilerplate per fetch. With TanStack Query:
```tsx
const { data, isPending, error } = useQuery({
  queryKey: ['course', id],
  queryFn: () => api.getCourse(id),
})
```

3 lines. Same result. Plus caching, deduplication, and background refetching for free.

### How `useQuery` works

```tsx
const courses = useQuery({
  queryKey: ['courses', filters],
  queryFn: () => api.listCourses(filters),
})
```

**`queryKey`** — a unique identifier for this piece of data. Think of it as a cache key. Two components that use `['courses', filters]` with the same filters share the same cache entry — one fetch, both get the data.

**`queryFn`** — the function that actually fetches. It only runs when:
- The cache is empty (first time)
- The cache is "stale" (invalidated by a mutation)
- The key changed (filters changed → new cache entry)

**The return object:**
- `courses.data` — the fetched data (undefined until loaded)
- `courses.isPending` — true while the first fetch is in progress
- `courses.error` — the Error object if the fetch failed
- `courses.isSuccess` — true if data loaded successfully

### How `useMutation` works

Mutations are for WRITE operations (POST, PUT, DELETE):

```tsx
const enroll = useMutation({
  mutationFn: () => api.enroll(courseId),
  onSuccess: () => {
    // After enrolling, tell TanStack Query that the enrollments data is stale.
    // It will automatically refetch it in the background.
    queryClient.invalidateQueries({ queryKey: ['enrollments'] })
  },
})
```

**`mutationFn`** — runs when you call `enroll.mutate()`. Unlike queries, mutations don't run automatically — you trigger them (e.g., on button click).

**`onSuccess`** — runs after the mutation succeeds. This is where you **invalidate** related queries.

**Cache invalidation** is the key concept. After the student enrolls:
1. The enrollment is created on the server ✓
2. But the "My Learning" page still shows the OLD enrollment list (from cache)
3. `invalidateQueries(['enrollments'])` marks that cache as stale
4. TanStack Query immediately refetches `GET /api/me/enrollments`
5. The "My Learning" page re-renders with the new enrollment

Without invalidation, the UI would be stuck showing old data until the user manually refreshes.

### The mutation return object

```tsx
<button
  onClick={() => enroll.mutate()}     // trigger the mutation
  disabled={enroll.isPending}          // disable while in flight
>
  {enroll.isPending ? 'Enrolling...' : 'Pay & Enroll'}
</button>
{enroll.error && <p>{enroll.error.message}</p>}
```

- `enroll.mutate()` — call this to fire the mutation
- `enroll.isPending` — true while the request is in flight
- `enroll.error` — the Error if the request failed
- `enroll.isSuccess` — true after a successful mutation

---

## Part 5: The API Client — `lib/api.ts`

### One file, one job

`api.ts` is the ONLY file that knows about HTTP URLs. Every component calls methods like `api.listCourses()`, never `fetch('/api/courses')`. This means:
- If the backend changes a URL, you fix ONE file
- TypeScript tells you the exact shape of every response
- All requests go through one function that handles cookies, errors, and auth recovery

### The `request` function

Every API call goes through this:

```tsx
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',           // send the auth cookie
    headers: { 'Content-Type': 'application/json' },
    ...init,                          // method, body, etc.
  })
  if (!res.ok) {
    // Extract error message from the JSON body
    // Dispatch auth event on 401/403 (for cross-tab recovery)
    throw new ApiError(message, res.status)  // ApiError extends Error with a status property
  }
  return res.json()
}
```

`<T>` is a **generic type parameter**. When you call `request<User>(...)`, TypeScript knows the return value is a `User`. When you call `request<Course[]>(...)`, it knows it's an array of Courses.

### Method examples

```tsx
export const api = {
  // GET request, no body
  listCourses: (q) => request<PagedResult<CourseListItem>>('/api/courses' + buildQuery(q)),

  // POST request with JSON body
  login: (body) => request<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }),

  // POST request, no body (course id is in the URL)
  enroll: (courseId) => request<EnrollResult>(`/api/courses/${courseId}/enroll`, {
    method: 'POST',
  }),

  // DELETE request, returns nothing (204 No Content)
  deleteReview: (courseId) => request<void>(`/api/courses/${courseId}/reviews`, {
    method: 'DELETE',
  }),
}
```

---

## Part 6: Authentication — The Full Picture

### How login works (the happy path)

```
1. User types email + password on Login.tsx
2. User clicks "Log in"
3. Login component calls: await login(email, password)
4. login() is from useAuth(), which calls api.login()
5. api.login() sends POST /api/auth/login to the backend
6. Backend verifies password, creates encrypted cookie, sends it back
7. Browser stores the lp.auth cookie automatically
8. api.login() returns the User object
9. AuthProvider's setUser(user) stores it in React state
10. RequireAuth sees user is not null → renders the page
11. HomeRedirect reads user.role → navigates to /my-learning (for students)
```

### How auth persists across page reloads

When you refresh the page:
1. React app starts from scratch (all state is gone)
2. `AuthProvider` runs `useEffect` → calls `GET /api/me`
3. Browser automatically sends the `lp.auth` cookie with the request
4. Backend reads the cookie, finds the user → returns user info
5. `setUser(user)` → you're logged in again without typing anything

The cookie is the persistence mechanism. React state is ephemeral (gone on refresh). The cookie survives.

### How the user menu logout works

```
1. User clicks "Log out" in the dropdown
2. Layout calls handleLogout() → auth.logout()
3. logout() calls api.logout() → POST /api/auth/logout
4. Backend clears the cookie (Set-Cookie with expiry in the past)
5. logout() calls setUser(null)
6. RequireAuth sees user is null → redirects to /login
```

### The cross-tab problem and how we solve it

Cookies are shared across browser tabs. If you:
1. Tab 1: logged in as Sarah (teacher)
2. Tab 2: log in as Alice (student) → replaces the cookie
3. Tab 1: click something → the request uses Alice's cookie → 403 Forbidden

Our fix: when `api.ts` sees a 401 or 403, it fires a custom event. `AuthProvider` listens for this event and re-fetches `/api/me`. The new user (Alice) doesn't match the teacher route → `RequireAuth` redirects.

---

## Part 7: Routing — How URLs Map to Pages

### The route tree

```tsx
createBrowserRouter([
  { path: '/login', Component: Login },          // public
  { path: '/register', Component: Register },    // public
  {
    path: '/',
    element: RequireAuth → Layout,               // protected (need login)
    children: [
      { index: true, Component: HomeRedirect },  // / → redirect by role
      { path: 'my-learning', ... },              // student only
      { path: 'catalog', ... },                  // student only
      { path: 'courses/:id', ... },              // student only
      { path: 'teacher/courses', ... },          // teacher only
      { path: 'admin/overview', ... },           // admin only
      { path: '*', Component: NotFound },        // catch-all 404
    ],
  },
])
```

**How it works:**
1. User navigates to `http://localhost:5173/courses/42`
2. React Router walks the tree: `/` matches → check children → `courses/:id` matches with `id = "42"`
3. Render chain: `RequireAuth` → `Layout` → `CourseDetails`
4. `CourseDetails` reads the `42` with `useParams()`

### Route parameters

```tsx
// Route definition:
{ path: 'courses/:id', Component: CourseDetails }

// Inside the component:
const { id } = useParams()   // id = "42" (always a string!)
const courseId = Number(id)   // convert to number for API calls
```

The `:id` is a **parameter placeholder**. Whatever appears in that URL position becomes available via `useParams()`.

### URL search params (for filters)

```tsx
// URL: /catalog?q=react&sort=price_asc&page=2

const [searchParams, setSearchParams] = useSearchParams()
const q = searchParams.get('q')          // "react"
const sort = searchParams.get('sort')    // "price_asc"
const page = searchParams.get('page')    // "2"
```

Filters live in the URL so they survive page refresh and can be shared via link.

---

## Part 8: Page Anatomy — How a Typical Page Works

Let's trace through `Dashboard.tsx` (the "My Learning" page) as an example.

### Step 1: Declare queries

```tsx
const enrollments = useQuery({
  queryKey: ['enrollments'],
  queryFn: api.listMyEnrollments,
})
const recommendations = useQuery({
  queryKey: ['recommendations'],
  queryFn: api.getRecommendations,
})
```

Two independent data fetches start in parallel. Each manages its own loading/error/data state.

### Step 2: Handle loading and errors

```tsx
{enrollments.isPending && <p>Loading…</p>}
{enrollments.error && <div className="...error styles...">{error.message}</div>}
{enrollments.data && enrollments.data.length === 0 && <p>No courses yet</p>}
```

Three conditional renders:
- Show loading text while fetching
- Show error if fetch failed
- Show empty state if no data

### Step 3: Render the data

```tsx
{enrollments.data?.map((e) => (
  <div key={e.id}>
    <h3>{e.courseTitle}</h3>
    <div style={{ width: `${e.progress}%` }}></div>
    <Link to={`/learn/${e.id}/${e.nextLessonId}`}>Continue</Link>
  </div>
))}
```

`.map()` transforms each enrollment object into a JSX card. `key={e.id}` helps React track which items changed.

### Step 4: Link to other pages

```tsx
<Link to={`/courses/${e.courseId}`}>View Course</Link>
<Link to={`/learn/${e.id}/${e.nextLessonId}`}>Continue Lesson</Link>
```

`<Link>` is React Router's version of `<a>`. It navigates without a full page reload — only the `<Outlet />` content changes.

---

## Part 9: Forms and Mutations — How Data Gets Saved

### The pattern (CourseEditor example)

```tsx
// 1. Local form state
const [form, setForm] = useState({ title: '', price: 0, ... })
const [dirty, setDirty] = useState(false)

// 2. Pre-fill when data loads
useEffect(() => {
  if (course.data) {
    setForm({ title: course.data.title, price: course.data.price, ... })
    setDirty(false)
  }
}, [course.data])

// 3. Define the save mutation
const save = useMutation({
  mutationFn: () => api.updateCourse(courseId, form),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['teacher-course', courseId] })
    setDirty(false)
  },
})

// 4. Input fields update form state
<input
  value={form.title}
  onChange={(e) => { setForm({...form, title: e.target.value}); setDirty(true) }}
/>

// 5. Save button
<button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>
  {save.isPending ? 'Saving...' : 'Save'}
</button>

// 6. Success indicator
{save.isSuccess && !dirty && <span>✓ Saved</span>}
```

**Frontend form validation:** Inputs use native HTML validation attributes — `required`, `maxLength`, `minLength` — on forms throughout the app (Register, CourseEditor, LessonForm, TeacherProfile, CourseDetails review). For example, the course title input has `maxLength={200}` and `required`, the description has `maxLength={2000}`, and the lesson form's Save button is `disabled` when title or content is empty. This gives instant browser-level feedback without custom validation code.

The flow:
1. Page loads → `useQuery` fetches course data
2. `useEffect` pre-fills the form with the fetched data
3. User edits a field → `setForm` updates local state, `setDirty(true)`
4. User clicks Save → `save.mutate()` sends the form to the API
5. On success → cache is invalidated (re-fetch shows saved values), `setDirty(false)`
6. "✓ Saved" appears (because `save.isSuccess && !dirty`)
7. User edits again → "✓ Saved" disappears (because `dirty` is true again)

---

## Part 10: Styling — How Tailwind CSS Works

### The idea

Instead of writing CSS files with class names and rules, you put utility classes directly on elements:

```tsx
// Traditional CSS:
// .card { padding: 1.5rem; border: 2px solid #1f2937; background: white; }
// <div className="card">

// Tailwind:
<div className="p-6 border-2 border-gray-800 bg-white">
```

Each class does ONE thing. You combine them to build any design.

### The most common classes in our app

**Spacing:**
- `p-4` = padding 1rem (16px) all sides. `p-6` = 1.5rem. `p-8` = 2rem.
- `mb-4` = margin-bottom 1rem. `mt-6` = margin-top 1.5rem. `gap-4` = gap between flex/grid children.

**Layout:**
- `flex` = display: flex. `flex-1` = flex-grow: 1 (take remaining space).
- `grid grid-cols-3` = 3-column grid.
- `items-center` = align-items: center. `justify-between` = justify-content: space-between.

**Typography:**
- `text-sm` = small text. `text-2xl` = large heading.
- `font-bold` = bold. `text-gray-900` = near-black. `text-gray-600` = medium gray.

**Borders and backgrounds:**
- `border-2 border-gray-800` = 2px dark border.
- `bg-white` = white background. `bg-gray-900` = near-black.

**Interactivity:**
- `hover:bg-gray-700` = change background on hover.
- `disabled:opacity-50` = semi-transparent when disabled.
- `transition-colors` = animate color changes smoothly.

### Reading a component's classes

```tsx
<button className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50">
```

Reading left to right:
- `px-6 py-2` → horizontal padding 1.5rem, vertical 0.5rem
- `border-2 border-gray-800` → 2px dark border
- `bg-gray-900 text-white` → dark background, white text
- `hover:bg-gray-700` → slightly lighter on hover
- `transition-colors` → smooth color transition
- `disabled:opacity-50` → half-transparent when disabled

---

## Part 11: The Reusable Components

### CourseCard

Used on: Catalog, Dashboard (recommendations), Author page. Extracted to eliminate duplicate card markup across three pages.

```tsx
<CourseCard
  id={course.id}
  title={course.title}
  price={course.price}
  averageRating={course.averageRating}
  reviewCount={course.reviewCount}
  createdAt={course.createdAt}
  author={course.author}          // optional — shown when available
  overlay={<Badge>Enrolled</Badge>}  // optional — slot for enrollment badges etc.
  titleExtra={<Info />}           // optional — slot for recommendation (i) icon
  buttonLabel="View Course"       // optional — custom button text
/>
```

Includes the `renderStars` helper internally. Props: `id`, `title`, `price`, `averageRating`, `reviewCount`, `createdAt`, plus optional `author`, `overlay`, `titleExtra`, `buttonLabel`.

### QueryError

Used on: CourseDetails, LessonPlayer, Author, CourseEditor, CourseAnalytics. Replaces ad-hoc error banners.

```tsx
<QueryError error={query.error} />
```

If the error is an `ApiError` with status 404, it renders the `NotFound` page. Otherwise it renders a standard red error banner with the error message.

### Pagination

Used on: Catalog, Admin Payments, Admin Payouts, Admin Users, Teacher Reviews.

```tsx
<Pagination
  page={currentPage}           // which page are we on
  pageSize={20}                // items per page
  totalCount={data.totalCount} // total items (from API)
  onPageChange={setPage}       // callback when user clicks a page number
/>
```

It renders "Showing 21–40 of 200" + clickable page numbers + prev/next arrows. Hides itself if there's only 1 page.

### DateRangePicker + useDateRange

Used on: Admin Dashboard, Teacher Analytics.

```tsx
const range = useDateRange()  // creates from/to state with debouncing
<DateRangePicker from={range.from} to={range.to} onChange={range.onChange} />

// In your query, use the DEBOUNCED values:
queryFn: () => api.getData(range.debouncedFrom, range.debouncedTo)
```

The inputs update instantly (typing feels responsive). The API query updates 500ms after you stop typing (prevents hammering the server while typing a year).

### CategoryMultiSelect

Used on: Catalog filters, Course Editor.

```tsx
<CategoryMultiSelect
  categories={allCategories}     // the full list
  selected={selectedIds}          // which ones are checked
  onChange={(ids) => ...}         // callback when selection changes
/>
```

Click to open a dropdown. Type to search. Click categories to toggle (with checkboxes). Selected items show as removable chips.

### RequireAuth

Used on: every protected route.

```tsx
<RequireAuth roles={['Student']}>
  <Dashboard />
</RequireAuth>
```

If not logged in → redirect to login. If logged in but wrong role → show "no access". Otherwise → render the children.

---

## Part 12: Putting It All Together — A Complete Flow

Let's trace what happens when a student enrolls in a course, from click to screen update.

### 1. Student clicks "Pay & Enroll" on CourseDetails

```tsx
<button onClick={() => enroll.mutate()}>Pay & Enroll</button>
```

### 2. TanStack Query runs the mutation

```tsx
const enroll = useMutation({
  mutationFn: () => api.enroll(courseId),
  ...
})
```

### 3. `api.enroll()` makes the HTTP request

```tsx
enroll: (courseId) => request<EnrollResult>(`/api/courses/${courseId}/enroll`, { method: 'POST' })
```

This calls `fetch('http://localhost:5000/api/courses/42/enroll', { method: 'POST', credentials: 'include' })`.

### 4. Backend processes the enrollment

The backend creates a Payment + Enrollment in a transaction. The payment trigger fires and credits the teacher's balance.

### 5. Backend responds with `{ enrollmentId: 1510, firstLessonId: 825 }`

### 6. `onSuccess` runs

```tsx
onSuccess: (res) => {
  qc.invalidateQueries({ queryKey: ['enrollments'] })
  qc.invalidateQueries({ queryKey: ['course', courseId] })
  nav(`/learn/${res.enrollmentId}/${res.firstLessonId}`)
}
```

Three things happen:
- The enrollments cache is invalidated (My Learning will refetch)
- The course detail cache is invalidated (enrollment count updates)
- Navigation to the lesson player

### 7. LessonPlayer renders

React Router swaps `<Outlet />` to render `LessonPlayer`. It calls `useQuery` to fetch the enrollment detail and lesson content.

### 8. Student sees the first lesson

The lesson content loads, the sidebar shows the course outline, the progress bar is at 0%.

**That's the complete chain: button click → mutation → API call → backend processing → cache invalidation → navigation → new queries → new UI.**

Every interaction in the app follows this same pattern, just with different endpoints and data shapes.
