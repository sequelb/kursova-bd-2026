import { Navigate } from 'react-router'
import { useAuth } from '../../lib/auth'

 // redirects the index route based on the current user's role
export function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return null
  switch (user.role) {
    case 'Student':
      return <Navigate to="/my-learning" replace />
    case 'Teacher':
      return <Navigate to="/teacher/courses" replace />
    case 'Admin':
      return <Navigate to="/admin/overview" replace />
  }
}
