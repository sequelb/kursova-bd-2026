const BASE = 'http://localhost:5000'

export type Role = 'Admin' | 'Teacher' | 'Student'

export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
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
}
