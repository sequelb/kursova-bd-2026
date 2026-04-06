import { Award, CheckCircle, BarChart, BookOpen, FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'

export function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const nav = useNavigate()
  const qc = useQueryClient()

  const course = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.getCourse(courseId),
    enabled: Number.isFinite(courseId),
  })

  const enrollments = useQuery({
    queryKey: ['enrollments'],
    queryFn: api.listMyEnrollments,
  })

  const existingEnrollment = enrollments.data?.find((e) => e.courseId === courseId)

  const enroll = useMutation({
    mutationFn: () => api.enroll(courseId),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['enrollments'] })
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      if (res.firstLessonId != null) {
        nav(`/learn/${res.enrollmentId}/${res.firstLessonId}`)
      }
    },
  })

  if (course.isPending || enrollments.isPending) {
    return <div className="p-8 text-gray-600">Loading…</div>
  }
  if (course.error) {
    return <div className="p-8 text-red-700">Failed: {(course.error as Error).message}</div>
  }
  if (!course.data) return null

  const c = course.data

  function handleContinue() {
    if (!existingEnrollment) return
    if (existingEnrollment.nextLessonId != null) {
      nav(`/learn/${existingEnrollment.id}/${existingEnrollment.nextLessonId}`)
    } else if (c.lessons.length > 0) {
      nav(`/learn/${existingEnrollment.id}/${c.lessons[0].id}`)
    }
  }

  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-[7]">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">{c.title}</h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">Categories:</span>
            {c.categories.map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1 border-2 border-gray-400 bg-gray-100 text-gray-900 text-sm"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="border-2 border-gray-400 bg-white p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{c.description}</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h2>
            <div className="border-2 border-gray-800 bg-white">
              {c.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-4 ${
                    index < c.lessons.length - 1 ? 'border-b-2 border-gray-400' : ''
                  }`}
                >
                  <span className="text-gray-900">{lesson.title}</span>
                </div>
              ))}
              {c.lessons.length === 0 && (
                <div className="p-4 text-gray-500">No lessons published yet.</div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Student Reviews{' '}
              <span className="text-sm font-normal text-gray-600">
                ({c.reviews.length} · avg {c.averageRating.toFixed(1)})
              </span>
            </h2>
            {c.reviews.length === 0 ? (
              <div className="border-2 border-gray-400 bg-white p-6 text-gray-600">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {c.reviews.map((r) => (
                  <div key={r.id} className="border-2 border-gray-400 bg-white p-6">
                    <div className="mb-2">
                      <span className="font-bold text-gray-900">
                        {r.studentFirstName} {r.studentLastName}
                      </span>
                      <span className="text-gray-600 text-sm ml-2">
                        — {new Date(r.createdAt).toISOString().slice(0, 10)} · {'★'.repeat(r.grade)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">${c.price.toFixed(2)}</div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Level: {c.level}</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">{c.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Format: Text-based</span>
              </div>
            </div>

            {existingEnrollment ? (
              <button
                onClick={handleContinue}
                className="w-full py-4 mb-6 border-2 border-gray-800 bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition-colors"
              >
                Continue Learning ({existingEnrollment.progress}%)
              </button>
            ) : (
              <button
                onClick={() => enroll.mutate()}
                disabled={enroll.isPending}
                className="w-full py-4 mb-6 border-2 border-gray-800 bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {enroll.isPending ? 'Enrolling…' : 'Pay & Enroll'}
              </button>
            )}
            {enroll.error && (
              <p className="mb-4 text-sm text-red-700">{(enroll.error as Error).message}</p>
            )}

            <div className="border-t-2 border-gray-400 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Certificate of completion</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Lifetime access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
