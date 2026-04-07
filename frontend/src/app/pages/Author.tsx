import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Star, User as UserIcon } from 'lucide-react'
import { api } from '../../lib/api'

function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= Math.round(rating)
            ? 'fill-gray-900 text-gray-900'
            : 'fill-gray-400 text-gray-400'
        }`}
      />,
    )
  }
  return stars
}

export function Author() {
  const { id } = useParams<{ id: string }>()
  const authorId = Number(id)

  const author = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => api.getAuthor(authorId),
    enabled: Number.isFinite(authorId),
  })

  if (author.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (author.error) {
    return <div className="p-8 text-red-700">Failed: {(author.error as Error).message}</div>
  }
  if (!author.data) return null

  const a = author.data

  return (
    <div className="p-8">
      {/* Header */}
      <div className="border-2 border-gray-800 bg-white p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 border-2 border-gray-800 bg-gray-200 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-8 h-8 text-gray-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {a.firstName} {a.lastName}
            </h1>
            <div className="text-sm text-gray-600 mt-1">
              {a.courses.length} published {a.courses.length === 1 ? 'course' : 'courses'}
            </div>
            {a.bio ? (
              <p className="text-gray-700 mt-3 whitespace-pre-wrap">{a.bio}</p>
            ) : (
              <p className="text-gray-500 italic mt-3">This author hasn't written a bio yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Courses</h2>
      {a.courses.length === 0 ? (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          No published courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {a.courses.map((course) => (
            <div key={course.id} className="border-2 border-gray-800 bg-white p-4 flex flex-col">
              <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm">[Image Placeholder]</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(course.averageRating)}
                <span className="ml-1 text-sm text-gray-600">
                  ({course.averageRating.toFixed(1)}) · {course.reviewCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Published: {new Date(course.createdAt).toISOString().slice(0, 10)}
              </p>
              <p className="font-bold text-gray-900 mb-4">${course.price.toFixed(2)}</p>
              <Link
                to={`/courses/${course.id}`}
                className="block w-full mt-auto py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
