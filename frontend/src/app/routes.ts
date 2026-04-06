import { createBrowserRouter } from 'react-router'
import { createElement } from 'react'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { Dashboard } from './pages/Dashboard'
import { Catalog } from './pages/Catalog'
import { CourseDetails } from './pages/CourseDetails'
import { LessonPlayer } from './pages/LessonPlayer'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'
import { CourseEditor } from './pages/teacher/CourseEditor'
import { Earnings } from './pages/teacher/Earnings'
import { StudentReviews } from './pages/teacher/StudentReviews'
import { CourseAnalytics } from './pages/teacher/CourseAnalytics'
import { AdminOverview } from './pages/admin/AdminOverview'
import { FinancialControls } from './pages/admin/FinancialControls'
import { TeacherPayouts } from './pages/admin/TeacherPayouts'
import { UserManagement } from './pages/admin/UserManagement'

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    path: '/',
    element: createElement(RequireAuth, null, createElement(Layout)),
    children: [
      // Student
      { index: true, Component: Dashboard },
      { path: 'catalog', Component: Catalog },
      { path: 'course-details', Component: CourseDetails },
      { path: 'lesson-player', Component: LessonPlayer },
      // Teacher
      { path: 'teacher/courses', Component: TeacherDashboard },
      { path: 'teacher/course-editor', Component: CourseEditor },
      { path: 'teacher/earnings', Component: Earnings },
      { path: 'teacher/reviews', Component: StudentReviews },
      { path: 'teacher/course-analytics', Component: CourseAnalytics },
      // Admin
      { path: 'admin/overview', Component: AdminOverview },
      { path: 'admin/payments', Component: FinancialControls },
      { path: 'admin/payouts', Component: TeacherPayouts },
      { path: 'admin/users', Component: UserManagement },
    ],
  },
])
