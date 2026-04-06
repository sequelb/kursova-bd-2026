import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../lib/auth'

export function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student' as 'Student' | 'Teacher',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      nav('/', { replace: true })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border-2 border-gray-800 bg-white p-8 space-y-5"
      >
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-bold text-gray-900">First name</span>
            <input
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-900">Last name</span>
            <input
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-gray-900">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-900">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
            minLength={6}
            className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-900">I am a</span>
          <select
            value={form.role}
            onChange={(e) => set('role', e.target.value as 'Student' | 'Teacher')}
            className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 border-2 border-gray-800 bg-gray-900 text-white font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        {error && (
          <p className="text-sm text-red-700 border-2 border-red-700 bg-red-50 p-2">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-700 text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-bold underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
