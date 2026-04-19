import { Star } from 'lucide-react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'

export function TeacherDashboard() {
  const courses = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: api.listMyTeacherCourses,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage My Courses</h1>
        <Link
          to="/teacher/courses/new"
          className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          Create New Course
        </Link>
      </div>

      {courses.isPending && <p className="text-gray-600">Loading…</p>}
      {courses.error && (
        <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">Failed to load: {(courses.error as Error).message}</div>
      )}
      {courses.data && courses.data.length === 0 && (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          You don't have any courses yet. Click "Create New Course" to get started.
        </div>
      )}

      {courses.data && courses.data.length > 0 && (
        <div className="grid grid-cols-4 gap-6">
          {courses.data.map((course) => (
            <div key={course.id} className="border-2 border-gray-800 bg-white">
              <div className="w-full h-40 border-b-2 border-gray-800 bg-gray-200 flex items-center justify-center relative">
                <span className="text-gray-500 text-sm">[Course Image]</span>
                <div
                  className={`absolute top-2 right-2 px-2 py-1 border-2 border-gray-800 text-xs font-bold ${
                    course.status === 'Published'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  {course.status}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">{course.title}</h3>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="text-gray-600">
                    Created: {new Date(course.createdAt).toISOString().slice(0, 10)}
                  </div>
                  <div className="text-gray-700">
                    Enrolled: {course.enrollmentCount} · {course.lessonCount} lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(course.averageRating)
                              ? 'fill-gray-900 text-gray-900'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className="text-gray-900 font-bold ml-1">
                        {course.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-700">${course.price.toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/teacher/courses/${course.id}/analytics`}
                    className="block w-full py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                  >
                    View Analytics
                  </Link>
                  <Link
                    to={`/teacher/courses/${course.id}/edit`}
                    className="block w-full py-2 text-center border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    Edit Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
