import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

export function Dashboard() {
  const enrollments = useQuery({
    queryKey: ['enrollments'],
    queryFn: api.listMyEnrollments,
  })

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
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Recommended Courses</h2>
        <p className="text-sm text-gray-600 mb-4">(Coming soon — algorithmic suggestions)</p>
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-500">
          Personalized recommendations will appear here once that feature is implemented.
        </div>
      </section>
    </div>
  )
}
