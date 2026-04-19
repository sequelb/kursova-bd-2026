const BASE = 'http://localhost:5000'

export type Role = 'Admin' | 'Teacher' | 'Student'

export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
}

export type Category = { id: number; name: string }
export type Author = { id: number; firstName: string; lastName: string }

export type CourseListItem = {
  id: number
  title: string
  price: number
  level: string
  createdAt: string
  author: Author
  categories: Category[]
  averageRating: number
  reviewCount: number
  enrollmentCount: number
}

export type LessonSummary = { id: number; orderNumber: number; title: string }

export type Review = {
  id: number
  grade: number
  comment: string
  createdAt: string
  studentFirstName: string
  studentLastName: string
}

export type CourseDetail = {
  id: number
  title: string
  description: string
  price: number
  level: string
  status: string
  createdAt: string
  author: Author
  categories: Category[]
  lessons: LessonSummary[]
  reviews: Review[]
  averageRating: number
  enrollmentCount: number
}

export type EnrollmentListItem = {
  id: number
  courseId: number
  courseTitle: string
  progress: number
  nextLessonId: number | null
  enrolledAt: string
}

export type MyReview = {
  id: number
  grade: number
  comment: string
  createdAt: string
}

export type EnrollmentDetail = {
  id: number
  courseId: number
  courseTitle: string
  progress: number
  enrolledAt: string
  lessons: LessonSummary[]
  completedLessonIds: number[]
  myReview: MyReview | null
}

export type LessonContent = {
  id: number
  orderNumber: number
  title: string
  content: string
}

export type RecommendedCourse = {
  id: number
  title: string
  price: number
  level: string
  createdAt: string
  author: Author
  categories: Category[]
  averageRating: number
  reviewCount: number
  enrollmentCount: number
  score: number
  confidence: number
  lift: number
  reason: string
}

export type EnrollResult = { enrollmentId: number; firstLessonId: number | null }

export type PagedResult<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export type CourseQuery = {
  q?: string
  categoryIds?: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  maxRating?: number
  createdAfter?: string
  createdBefore?: string
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating_desc'
  page?: number
  pageSize?: number
}

function buildCourseQuery(q: CourseQuery): string {
  const params = new URLSearchParams()
  if (q.q) params.set('q', q.q)
  if (q.categoryIds?.length) for (const id of q.categoryIds) params.append('categoryIds', String(id))
  if (q.minPrice != null) params.set('minPrice', String(q.minPrice))
  if (q.maxPrice != null) params.set('maxPrice', String(q.maxPrice))
  if (q.minRating != null) params.set('minRating', String(q.minRating))
  if (q.maxRating != null) params.set('maxRating', String(q.maxRating))
  if (q.createdAfter) params.set('createdAfter', q.createdAfter)
  if (q.createdBefore) params.set('createdBefore', q.createdBefore)
  if (q.sort) params.set('sort', q.sort)
  if (q.page != null) params.set('page', String(q.page))
  if (q.pageSize != null) params.set('pageSize', String(q.pageSize))
  const s = params.toString()
  return s ? `?${s}` : ''
}

/**
 * Dispatched whenever an API call returns 401 or 403. The auth provider listens
 * for it and re-fetches `/api/me` so that `RequireAuth` can redirect the user
 * if their session is gone or their role no longer matches the route.
 *
 * This catches the "two-tab cookie swap" case: opening a second tab and logging
 * in as a different user replaces the cookie shared by both tabs, and we want
 * the first tab to notice the next time it tries to do anything.
 */
export const AUTH_INVALIDATED_EVENT = 'lp:auth-invalidated'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && path !== '/api/me') {
      // Don't dispatch for /api/me itself — that would cause infinite loops.
      window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT))
    }
    let body: unknown = null
    try {
      body = await res.json()
    } catch {
      /* ignore */
    }
    const message =
      (body as { error?: string; errors?: string[] } | null)?.error ??
      (body as { errors?: string[] } | null)?.errors?.join(', ') ??
      `HTTP ${res.status}`
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  // ---- auth ----
  register: (body: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'Student' | 'Teacher'
  }) =>
    request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  me: () => request<User>('/api/me'),

  // ---- recommendations ----
  getRecommendations: () => request<RecommendedCourse[]>('/api/me/recommendations'),

  // ---- catalog ----
  listCategories: () => request<Category[]>('/api/categories'),
  listCourses: (q: CourseQuery = {}) =>
    request<PagedResult<CourseListItem>>('/api/courses' + buildCourseQuery(q)),
  getCourse: (id: number) => request<CourseDetail>(`/api/courses/${id}`),

  // ---- student / enrollments ----
  listMyEnrollments: () => request<EnrollmentListItem[]>('/api/me/enrollments'),
  getEnrollment: (id: number) => request<EnrollmentDetail>(`/api/me/enrollments/${id}`),
  getLessonContent: (enrollmentId: number, lessonId: number) =>
    request<LessonContent>(`/api/me/enrollments/${enrollmentId}/lessons/${lessonId}`),
  enroll: (courseId: number) =>
    request<EnrollResult>(`/api/courses/${courseId}/enroll`, { method: 'POST' }),
  completeLesson: (enrollmentId: number, lessonId: number) =>
    request<void>(`/api/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, { method: 'POST' }),
  uncompleteLesson: (enrollmentId: number, lessonId: number) =>
    request<void>(`/api/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, { method: 'DELETE' }),
  createReview: (courseId: number, body: { grade: number; comment: string }) =>
    request<Review>(`/api/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateReview: (courseId: number, body: { grade: number; comment: string }) =>
    request<Review>(`/api/courses/${courseId}/reviews`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteReview: (courseId: number) =>
    request<void>(`/api/courses/${courseId}/reviews`, { method: 'DELETE' }),

  // ---- teacher: courses ----
  listMyTeacherCourses: () => request<TeacherCourseListItem[]>('/api/teacher/courses'),
  getMyTeacherCourse: (id: number) => request<TeacherCourseDetail>(`/api/teacher/courses/${id}`),
  createCourse: (body: CreateCourseRequest) =>
    request<TeacherCourseDetail>('/api/teacher/courses', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateCourse: (id: number, body: CreateCourseRequest) =>
    request<TeacherCourseDetail>(`/api/teacher/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteCourse: (id: number) =>
    request<void>(`/api/teacher/courses/${id}`, { method: 'DELETE' }),
  publishCourse: (id: number) =>
    request<void>(`/api/teacher/courses/${id}/publish`, { method: 'POST' }),
  unpublishCourse: (id: number) =>
    request<void>(`/api/teacher/courses/${id}/unpublish`, { method: 'POST' }),

  // ---- teacher: lessons ----
  addLesson: (courseId: number, body: { title: string; content: string }) =>
    request<LessonEdit>(`/api/teacher/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateLesson: (id: number, body: { title: string; content: string }) =>
    request<LessonEdit>(`/api/teacher/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteLesson: (id: number) =>
    request<void>(`/api/teacher/lessons/${id}`, { method: 'DELETE' }),
  reorderLessons: (courseId: number, lessonIds: number[]) =>
    request<void>(`/api/teacher/courses/${courseId}/lessons/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ lessonIds }),
    }),

  // ---- teacher: analytics & reviews ----
  getCourseAnalytics: (id: number) =>
    request<CourseAnalytics>(`/api/teacher/courses/${id}/analytics`),
  getEnrollmentsTimeline: (id: number, from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const qs = params.toString()
    return request<TimelinePoint[]>(`/api/teacher/courses/${id}/enrollments-timeline${qs ? '?' + qs : ''}`)
  },
  listMyTeacherReviews: (courseId?: number, page = 1, pageSize = 20) => {
    const params = new URLSearchParams()
    if (courseId != null) params.set('courseId', String(courseId))
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    return request<PagedResult<TeacherReview>>(`/api/teacher/reviews?${params}`)
  },

  // ---- teacher: earnings ----
  getEarnings: () => request<Earnings>('/api/teacher/earnings'),
  requestPayout: (amount: number) =>
    request<PayoutHistoryItem>('/api/teacher/payouts', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  // ---- teacher: my profile (bio) ----
  getMyTeacherProfile: () => request<MyTeacherProfile>('/api/me/teacher-profile'),
  updateMyTeacherProfile: (bio: string) =>
    request<MyTeacherProfile>('/api/me/teacher-profile', {
      method: 'PUT',
      body: JSON.stringify({ bio }),
    }),

  // ---- public author page ----
  getAuthor: (id: number) => request<AuthorPublic>(`/api/authors/${id}`),

  // ---- admin: finance ----
  getAdminFinanceDashboard: (from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const qs = params.toString()
    return request<AdminFinanceDashboard>(`/api/admin/finance-dashboard${qs ? '?' + qs : ''}`)
  },
  listAdminPayments: (status?: string, q?: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (q) params.set('q', q)
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    return request<PagedResult<AdminPayment>>(`/api/admin/payments?${params}`)
  },
  refundPayment: (id: number) =>
    request<void>(`/api/admin/payments/${id}/refund`, { method: 'POST' }),

  // ---- admin: payouts ----
  listAdminPayouts: (status?: string, q?: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (q) params.set('q', q)
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    return request<PagedResult<AdminPayout>>(`/api/admin/payouts?${params}`)
  },
  approvePayout: (id: number) =>
    request<void>(`/api/admin/payouts/${id}/approve`, { method: 'POST' }),
  rejectPayout: (id: number) =>
    request<void>(`/api/admin/payouts/${id}/reject`, { method: 'POST' }),
  markPayoutPaid: (id: number) =>
    request<void>(`/api/admin/payouts/${id}/mark-paid`, { method: 'POST' }),

  // ---- admin: users ----
  listAdminUsers: (filters: { role?: string; status?: string; q?: string; page?: number; pageSize?: number } = {}) => {
    const params = new URLSearchParams()
    if (filters.role) params.set('role', filters.role)
    if (filters.status) params.set('status', filters.status)
    if (filters.q) params.set('q', filters.q)
    params.set('page', String(filters.page ?? 1))
    params.set('pageSize', String(filters.pageSize ?? 20))
    return request<PagedResult<AdminUser>>(`/api/admin/users?${params}`)
  },
  updateUserStatus: (id: number, status: 'Active' | 'Suspended') =>
    request<void>(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}

// ---- admin types ----

export type TimelinePointMoney = { date: string; amount: number }

export type AdminFinanceDashboard = {
  grossRevenue: number
  totalRefunds: number
  paidToTeachers: number
  pendingPayoutsAmount: number
  pendingPayoutsCount: number
  revenueTimeline: TimelinePointMoney[]
  payoutsTimeline: TimelinePointMoney[]
}

export type AdminPayment = {
  id: number
  createdAt: string
  studentId: number
  studentName: string
  studentEmail: string
  courseId: number
  courseTitle: string
  amount: number
  status: 'Completed' | 'Refunded'
}

export type AdminPayout = {
  id: number
  requestedAt: string
  teacherId: number
  teacherName: string
  teacherEmail: string
  amount: number
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
}

export type AdminUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'Admin' | 'Teacher' | 'Student'
  status: 'Active' | 'Suspended'
}

// ---- teacher types ----

export type TeacherCourseListItem = {
  id: number
  title: string
  status: 'Draft' | 'Published'
  level: string
  price: number
  enrollmentCount: number
  averageRating: number
  lessonCount: number
  createdAt: string
}

export type LessonEdit = {
  id: number
  orderNumber: number
  title: string
  content: string
}

export type TeacherCourseDetail = {
  id: number
  title: string
  description: string
  price: number
  level: string
  status: 'Draft' | 'Published'
  createdAt: string
  categories: Category[]
  lessons: LessonEdit[]
}

export type CreateCourseRequest = {
  title: string
  description: string
  price: number
  level: string
  categoryIds: number[]
}

export type CourseAnalytics = {
  courseId: number
  courseTitle: string
  enrollmentCount: number
  revenue: number
  averageRating: number
  completionRate: number
  recentStudents: { firstName: string; lastName: string; enrolledAt: string; progress: number }[]
}

export type TimelinePoint = { date: string; count: number }

export type TeacherReview = {
  id: number
  courseId: number
  courseTitle: string
  studentFirstName: string
  studentLastName: string
  grade: number
  comment: string
  createdAt: string
}

export type PayoutHistoryItem = {
  id: number
  amount: number
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
  requestedAt: string
}

export type Earnings = { balance: number; history: PayoutHistoryItem[] }

export type MyTeacherProfile = { bio: string; balance: number }

export type AuthorPublic = {
  id: number
  firstName: string
  lastName: string
  bio: string
  courses: {
    id: number
    title: string
    price: number
    level: string
    createdAt: string
    averageRating: number
    reviewCount: number
  }[]
}
