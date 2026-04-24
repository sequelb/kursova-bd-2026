import { ChevronLeft, ChevronRight, CheckCircle, Circle, Star, FileText } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { QueryError } from '../components/QueryError'

export function LessonPlayer() {
  const { enrollmentId: enrollmentIdStr, lessonId: lessonIdStr } = useParams<{
    enrollmentId: string
    lessonId: string
  }>()
  const enrollmentId = Number(enrollmentIdStr)
  const lessonId = Number(lessonIdStr)
  const nav = useNavigate()
  const qc = useQueryClient()

  const enrollment = useQuery({
    queryKey: ['enrollment', enrollmentId],
    queryFn: () => api.getEnrollment(enrollmentId),
    enabled: Number.isFinite(enrollmentId),
  })

  const lesson = useQuery({
    queryKey: ['lesson', enrollmentId, lessonId],
    queryFn: () => api.getLessonContent(enrollmentId, lessonId),
    enabled: Number.isFinite(enrollmentId) && Number.isFinite(lessonId),
  })

  const complete = useMutation({
    mutationFn: () => api.completeLesson(enrollmentId, lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', enrollmentId] })
      qc.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })

  const uncomplete = useMutation({
    mutationFn: () => api.uncompleteLesson(enrollmentId, lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', enrollmentId] })
      qc.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })

  if (enrollment.isPending || lesson.isPending) {
    return <div className="p-8 text-gray-600">Loading…</div>
  }
  if (enrollment.error || lesson.error) {
    return <QueryError error={(enrollment.error ?? lesson.error) as Error} />
  }
  if (!enrollment.data || !lesson.data) return null

  const e = enrollment.data
  const l = lesson.data
  const completedSet = new Set(e.completedLessonIds)
  const isCompleted = completedSet.has(l.id)

  const sortedLessons = [...e.lessons].sort((a, b) => a.orderNumber - b.orderNumber)
  const currentIndex = sortedLessons.findIndex((x) => x.id === l.id)
  const prev = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const next = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const allDone = sortedLessons.every((x) => completedSet.has(x.id))

  return (
    <div className="p-8">
      <div className="flex gap-8">

        {/* left */}
        <div className="flex-[7]">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">{l.title}</h1>

          <div className="w-full border-2 border-gray-800 bg-white p-8 mb-6">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{l.content}</div>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              disabled={!prev}
              onClick={() => prev && nav(`/learn/${enrollmentId}/${prev.id}`)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Lesson</span>
            </button>
            <button
              disabled={!next}
              onClick={() => next && nav(`/learn/${enrollmentId}/${next.id}`)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            {isCompleted ? (
              <button
                disabled={uncomplete.isPending}
                onClick={() => uncomplete.mutate()}
                className="ml-auto flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{uncomplete.isPending ? 'Saving…' : 'Mark as Incomplete'}</span>
              </button>
            ) : (
              <button
                disabled={complete.isPending}
                onClick={() => complete.mutate()}
                className="ml-auto flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{complete.isPending ? 'Saving…' : 'Mark Complete'}</span>
              </button>
            )}
          </div>

          {allDone && (
            <Link
              to={`/courses/${e.courseId}${e.myReview ? '' : '?review=open'}`}
              className="block border-2 border-gray-800 bg-gray-100 p-6 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-gray-900" />
                <div>
                  <div className="font-bold text-gray-900">
                    {e.myReview ? 'Course finished — view your review' : 'Course finished!'}
                  </div>
                  {e.myReview
                    ? 'Open the course page to read or edit your review.'
                    : 'Head to the course page to leave a review.'}
                  <div className="text-sm text-gray-700">
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700 ml-auto" />
              </div>
            </Link>
          )}
        </div>

        {/* right */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white">
            <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
              <Link
                to={`/courses/${e.courseId}`}
                className="font-bold text-gray-900 hover:underline"
              >
                {e.courseTitle}
              </Link>
            </div>

            <div>
              {sortedLessons.map((x, index) => {
                const done = completedSet.has(x.id)
                const isCurrent = x.id === l.id
                return (
                  <Link
                    key={x.id}
                    to={`/learn/${enrollmentId}/${x.id}`}
                    className={`flex items-center gap-3 p-4 transition-colors ${isCurrent
                      ? 'bg-gray-200 border-l-4 border-l-gray-900'
                      : 'hover:bg-gray-50'
                      } ${index < sortedLessons.length - 1 ? 'border-b-2 border-gray-400' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {done ? (
                        <CheckCircle className="w-5 h-5 text-gray-900" />
                      ) : isCurrent ? (
                        <FileText className="w-5 h-5 text-gray-900" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${isCurrent ? 'font-bold text-gray-900' : 'text-gray-900'}`}
                    >
                      {x.title}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div className="border-t-2 border-gray-800 bg-gray-100 p-4">
              <div className="text-sm text-gray-700 mb-2">Course Progress</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 border-2 border-gray-800 bg-gray-100">
                  <div className="h-full bg-gray-900" style={{ width: `${e.progress}%` }}></div>
                </div>
                <span className="text-sm font-bold text-gray-900">{e.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
