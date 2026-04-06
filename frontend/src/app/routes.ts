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

const studentOnly = (el: React.ReactElement) =>
  createElement(RequireAuth, { roles: ['Student'] }, el)
const teacherOnly = (el: React.ReactElement) =>
  createElement(RequireAuth, { roles: ['Teacher'] }, el)
const adminOnly = (el: React.ReactElement) =>
  createElement(RequireAuth, { roles: ['Admin'] }, el)

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    path: '/',
    element: createElement(RequireAuth, null, createElement(Layout)),
    children: [
      // Student
      { index: true, element: studentOnly(createElement(Dashboard)) },
      { path: 'catalog', element: studentOnly(createElement(Catalog)) },
      { path: 'courses/:id', element: studentOnly(createElement(CourseDetails)) },
      {
        path: 'learn/:enrollmentId/:lessonId',
        element: studentOnly(createElement(LessonPlayer)),
      },
      // Teacher
      { path: 'teacher/courses', element: teacherOnly(createElement(TeacherDashboard)) },
      { path: 'teacher/course-editor', element: teacherOnly(createElement(CourseEditor)) },
      { path: 'teacher/earnings', element: teacherOnly(createElement(Earnings)) },
      { path: 'teacher/reviews', element: teacherOnly(createElement(StudentReviews)) },
      { path: 'teacher/course-analytics', element: teacherOnly(createElement(CourseAnalytics)) },
      // Admin
      { path: 'admin/overview', element: adminOnly(createElement(AdminOverview)) },
      { path: 'admin/payments', element: adminOnly(createElement(FinancialControls)) },
      { path: 'admin/payouts', element: adminOnly(createElement(TeacherPayouts)) },
      { path: 'admin/users', element: adminOnly(createElement(UserManagement)) },
    ],
  },
])
