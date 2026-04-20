import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../lib/auth'
import type { Role } from '../../lib/api'
import { NotFound } from '../pages/NotFound'

type Props = {
  children: ReactNode
  roles?: Role[]
}

// re-export so other code can import Role from here if it wants
export type { Role }

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
    return <NotFound />
  }

  return <>{children}</>
}
