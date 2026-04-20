import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, AUTH_INVALIDATED_EVENT, type User } from './api'

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (body: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'Student' | 'Teacher'
  }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))

    const interval = setInterval(() => {
      api.me().then(setUser).catch(() => setUser(null))
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  // Re-fetch /api/me whenever any API call gets 401/403. This catches the
  // "two-tab cookie swap" case where another tab replaced the auth cookie.
  useEffect(() => {
    const handler = () => {
      api.me().then(setUser).catch(() => setUser(null))
    }
    window.addEventListener(AUTH_INVALIDATED_EVENT, handler)
    return () => window.removeEventListener(AUTH_INVALIDATED_EVENT, handler)
  }, [])

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
