import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useDebounce } from '../../../lib/useDebounce'
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

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}
function daysAgo(n: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - n)
  return isoDate(d)
}
function today() {
  return isoDate(new Date())
}

const PRESETS = [
  { label: 'Last 7 days', from: () => daysAgo(6), to: today },
  { label: 'Last 30 days', from: () => daysAgo(29), to: today },
  { label: 'Last 90 days', from: () => daysAgo(89), to: today },
  { label: 'Last 365 days', from: () => daysAgo(364), to: today },
]

export function CourseAnalytics() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const [from, setFrom] = useState(daysAgo(29))
  const [to, setTo] = useState(today())
  const debouncedFrom = useDebounce(from)
  const debouncedTo = useDebounce(to)

  const analytics = useQuery({
    queryKey: ['course-analytics', courseId],
    queryFn: () => api.getCourseAnalytics(courseId),
    enabled: Number.isFinite(courseId),
  })
  const timeline = useQuery({
    queryKey: ['enrollments-timeline', courseId, debouncedFrom, debouncedTo],
    queryFn: () => api.getEnrollmentsTimeline(courseId, debouncedFrom, debouncedTo),
    enabled: Number.isFinite(courseId),
  })

  const chartData = useMemo(() => {
    if (!timeline.data) return []
    const points = timeline.data
    const days = points.length
    const bucketDays = days <= 60 ? 1 : days <= 365 ? 7 : 30
    const labelFn = (dateStr: string) =>
      bucketDays >= 30 ? dateStr.slice(0, 7) : dateStr.slice(5, 10)

    if (bucketDays === 1) {
      return points.map((p) => ({
        label: labelFn(p.date),
        enrollments: p.count,
      }))
    }
    const buckets: { label: string; enrollments: number }[] = []
    for (let i = 0; i < days; i += bucketDays) {
      let sum = 0
      const end = Math.min(i + bucketDays, days)
      for (let j = i; j < end; j++) sum += points[j].count
      buckets.push({ label: labelFn(points[i].date), enrollments: sum })
    }
    return buckets
  }, [timeline.data])

  if (analytics.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (analytics.error) {
    return <div className="p-8 text-red-700">Failed: {(analytics.error as Error).message}</div>
  }
  if (!analytics.data) return null

  const a = analytics.data

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

      {/* Date range picker + chart */}
      <div className="border-2 border-gray-800 bg-white mb-8">
        <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-gray-900">Enrollments</span>
            <input
              type="date"
              value={from}
              min="2010-01-01"
              max={to}
              onChange={(e) => { if (e.target.value >= '2010-01-01') setFrom(e.target.value) }}
              className="px-3 py-1 border-2 border-gray-800 bg-white text-sm"
            />
            <span className="text-gray-700">—</span>
            <input
              type="date"
              value={to}
              min={from}
              max={today()}
              onChange={(e) => { if (e.target.value >= '2010-01-01') setTo(e.target.value) }}
              className="px-3 py-1 border-2 border-gray-800 bg-white text-sm"
            />
            <div className="ml-auto flex items-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setFrom(p.from()); setTo(p.to()) }}
                  className="px-3 py-1 border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-200 text-xs transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 h-72">
          {timeline.isPending && <p className="text-gray-600">Loading chart…</p>}
          {timeline.error && (
            <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">
              {(timeline.error as Error).message}
            </div>
          )}
          {timeline.data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis
                  dataKey="label"
                  stroke="#374151"
                  tick={{ fontSize: 11 }}
                  interval={Math.max(0, Math.floor(chartData.length / 15))}
                />
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
          Recent Students (last 10)
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
