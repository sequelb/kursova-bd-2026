import { ApiError } from '../../lib/api'
import { NotFound } from '../pages/NotFound'

export function QueryError({ error }: { error: Error }) {
  if (error instanceof ApiError && error.status === 404) {
    return <NotFound />
  }
  return (
    <div className="p-8">
      <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">
        Failed to load: {error.message}
      </div>
    </div>
  )
}
