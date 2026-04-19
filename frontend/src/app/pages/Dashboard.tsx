import { Info, Star } from 'lucide-react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
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

export function Dashboard() {
  const enrollments = useQuery({
    queryKey: ['enrollments'],
    queryFn: api.listMyEnrollments,
  })
  const recommendations = useQuery({
    queryKey: ['recommendations'],
    queryFn: api.getRecommendations,
  })

  const [showReasons, setShowReasons] = useState(true)

  return (
    <div className="p-8">
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">My Learning Progress</h2>

        {enrollments.isPending && <p className="text-gray-600">Loading…</p>}
        {enrollments.error && (
          <p className="text-red-700">
            Failed to load: {(enrollments.error as Error).message}
          </p>
        )}
        {enrollments.data && enrollments.data.length === 0 && (
          <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
            You haven't enrolled in any courses yet.{' '}
            <Link to="/catalog" className="font-bold underline text-gray-900">
              Browse the catalog
            </Link>
            .
          </div>
        )}

        <div className="space-y-4">
          {enrollments.data?.map((e) => (
            <div key={e.id} className="border-2 border-gray-800 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-3">{e.courseTitle}</h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{e.progress}%</span>
                    </div>
                    <div className="w-full h-4 border-2 border-gray-800 bg-gray-100">
                      <div
                        className="h-full bg-gray-900"
                        style={{ width: `${e.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {e.nextLessonId != null ? (
                  <Link
                    to={`/learn/${e.id}/${e.nextLessonId}`}
                    className="ml-6 px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
                  >
                    Continue Lesson
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${e.courseId}`}
                    className="ml-6 px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    Course Finished
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended Courses</h2>
            <p className="text-sm text-gray-600">Based on what students like you enrolled in</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showReasons}
              onChange={(e) => setShowReasons(e.target.checked)}
              className="w-4 h-4"
            />
            Show explanations
          </label>
        </div>

        {recommendations.isPending && <p className="text-gray-600">Loading…</p>}
        {recommendations.error && (
          <p className="text-red-700">
            Failed: {(recommendations.error as Error).message}
          </p>
        )}
        {recommendations.data && recommendations.data.length === 0 && (
          <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
            No recommendations yet — enroll in some courses first!
          </div>
        )}

        {recommendations.data && recommendations.data.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {recommendations.data.map((course) => (
              <div
                key={course.id}
                className="border-2 border-gray-800 bg-white p-4 flex flex-col"
              >
                <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500 text-sm">[Image Placeholder]</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                  {showReasons && (
                    <div className="relative group flex-shrink-0">
                      <Info className="w-4 h-4 text-gray-500 cursor-help mt-1" />
                      <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-72 p-3 border-2 border-gray-800 bg-white shadow-lg text-sm text-gray-700 space-y-1">
                        <div>{course.reason}</div>
                        <div className="border-t border-gray-300 pt-1 mt-1 text-xs text-gray-500 space-y-0.5">
                          <div>Confidence: {course.confidence.toFixed(1)}%</div>
                          <div>Lift: {course.lift.toFixed(2)}×</div>
                          <div>Rating: {course.averageRating.toFixed(1)}★</div>
                          <div>Score: {course.score.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(course.averageRating)}
                  <span className="ml-1 text-sm text-gray-600">
                    ({course.averageRating.toFixed(1)}) · {course.reviewCount}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  By{' '}
                  <Link
                    to={`/authors/${course.author.id}`}
                    className="text-gray-900 hover:underline"
                  >
                    {course.author.firstName} {course.author.lastName}
                  </Link>
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
      </section>
    </div>
  )
}
