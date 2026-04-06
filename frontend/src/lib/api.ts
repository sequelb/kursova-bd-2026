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

export type EnrollResult = { enrollmentId: number; firstLessonId: number | null }

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
  const s = params.toString()
  return s ? `?${s}` : ''
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
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

  // ---- catalog ----
  listCategories: () => request<Category[]>('/api/categories'),
  listCourses: (q: CourseQuery = {}) =>
    request<CourseListItem[]>('/api/courses' + buildCourseQuery(q)),
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
}
