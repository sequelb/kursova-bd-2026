import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../../../lib/api'

export function CourseAnalytics() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)

  const analytics = useQuery({
    queryKey: ['course-analytics', courseId],
    queryFn: () => api.getCourseAnalytics(courseId),
    enabled: Number.isFinite(courseId),
  })
  const timeline = useQuery({
    queryKey: ['enrollments-timeline', courseId, 30],
    queryFn: () => api.getEnrollmentsTimeline(courseId, 30),
    enabled: Number.isFinite(courseId),
  })

  if (analytics.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (analytics.error) {
    return <div className="p-8 text-red-700">Failed: {(analytics.error as Error).message}</div>
  }
  if (!analytics.data) return null

  const a = analytics.data

  const chartData = (timeline.data ?? []).map((p) => ({
    date: new Date(p.date).toISOString().slice(5, 10), // MM-DD
    enrollments: p.count,
  }))

  return (
    <div className="p-8">
      <Link
        to="/teacher/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Courses
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics: {a.courseTitle}</h1>
        <Link
          to={`/teacher/courses/${courseId}/edit`}
          className="px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
        >
          Edit Course
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-gray-800 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-gray-900">{a.enrollmentCount}</div>
          <div className="text-sm text-gray-600 mt-1">Total Enrolled</div>
        </div>
        <div className="border-2 border-gray-800 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-gray-900">${a.revenue.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Course Revenue</div>
        </div>
        <div className="border-2 border-gray-800 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-gray-900">{a.averageRating.toFixed(1)} ★</div>
          <div className="text-sm text-gray-600 mt-1">Average Rating</div>
        </div>
        <div className="border-2 border-gray-800 bg-white p-6 text-center">
          <div className="text-3xl font-bold text-gray-900">{a.completionRate.toFixed(0)}%</div>
          <div className="text-sm text-gray-600 mt-1">Completion Rate</div>
        </div>
      </div>

      {/* Timeline chart */}
      <div className="border-2 border-gray-800 bg-white mb-8">
        <div className="border-b-2 border-gray-800 bg-gray-100 p-4 font-bold text-gray-900">
          Enrollments (Last 30 Days)
        </div>
        <div className="p-4 h-72">
          {timeline.isPending && <p className="text-gray-600">Loading chart…</p>}
          {timeline.data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis dataKey="date" stroke="#374151" />
                <YAxis allowDecimals={false} stroke="#374151" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent students */}
      <div className="border-2 border-gray-800 bg-white">
        <div className="border-b-2 border-gray-800 bg-gray-100 p-4 font-bold text-gray-900">
          Recent Students
        </div>
        {a.recentStudents.length === 0 ? (
          <div className="p-4 text-gray-600">No enrollments yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-900">Student Name</th>
                <th className="text-left p-3 font-bold text-gray-900">Enrollment Date</th>
                <th className="text-left p-3 font-bold text-gray-900">Progress</th>
              </tr>
            </thead>
            <tbody>
              {a.recentStudents.map((s, i) => (
                <tr key={i} className="border-b border-gray-300 last:border-b-0">
                  <td className="p-3 text-gray-900">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="p-3 text-gray-700">
                    {new Date(s.enrolledAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3 text-gray-700">{s.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
