import { Info } from 'lucide-react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../lib/api'
import { CourseCard } from '../components/CourseCard'

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
          <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">
            Failed to load: {(enrollments.error as Error).message}
          </div>
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
          <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">
            Failed: {(recommendations.error as Error).message}
          </div>
        )}
        {recommendations.data && recommendations.data.length === 0 && (
          <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
            No recommendations yet — enroll in some courses first!
          </div>
        )}

        {recommendations.data && recommendations.data.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {recommendations.data.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                price={course.price}
                averageRating={course.averageRating}
                reviewCount={course.reviewCount}
                createdAt={course.createdAt}
                author={course.author}
                titleExtra={
                  showReasons ? (
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
                  ) : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
