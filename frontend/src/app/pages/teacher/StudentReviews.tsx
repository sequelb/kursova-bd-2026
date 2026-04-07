import { Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../../lib/api'

export function StudentReviews() {
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all')

  const courses = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: api.listMyTeacherCourses,
  })
  const reviews = useQuery({
    queryKey: ['teacher-reviews', courseFilter],
    queryFn: () =>
      api.listMyTeacherReviews(courseFilter === 'all' ? undefined : courseFilter),
  })

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Student Reviews</h1>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900">Filter by course:</span>
        <select
          value={courseFilter}
          onChange={(e) =>
            setCourseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
          }
          className="px-3 py-2 border-2 border-gray-800 bg-white"
        >
          <option value="all">All courses</option>
          {courses.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {reviews.isPending && <p className="text-gray-600">Loading…</p>}
      {reviews.error && (
        <p className="text-red-700">Failed: {(reviews.error as Error).message}</p>
      )}
      {reviews.data && reviews.data.length === 0 && (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          No reviews{courseFilter !== 'all' ? ' for this course' : ''} yet.
        </div>
      )}

      <div className="space-y-4">
        {reviews.data?.map((r) => (
          <div key={r.id} className="border-2 border-gray-800 bg-white p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-gray-900">
                  {r.studentFirstName} {r.studentLastName}
                </div>
                <div className="text-sm text-gray-600">
                  {r.courseTitle} · {new Date(r.createdAt).toISOString().slice(0, 10)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.grade ? 'fill-gray-900 text-gray-900' : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
