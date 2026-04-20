import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <Link
        to="/"
        className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
