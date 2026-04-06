import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../lib/auth'

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('alice@local')
  const [password, setPassword] = useState('Passw0rd!')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      nav('/', { replace: true })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border-2 border-gray-800 bg-white p-8 space-y-5"
      >
        <h1 className="text-2xl font-bold text-gray-900">Log in</h1>

        <label className="block">
          <span className="text-sm font-bold text-gray-900">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-900">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 border-2 border-gray-800 bg-gray-900 text-white font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        {error && (
          <p className="text-sm text-red-700 border-2 border-red-700 bg-red-50 p-2">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-700 text-center">
          No account?{' '}
          <Link to="/register" className="font-bold underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
