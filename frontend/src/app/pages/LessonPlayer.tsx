import { ChevronLeft, ChevronRight, CheckCircle, Lock, Star, FileText } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

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

  // ---- review form state ----
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewGrade, setReviewGrade] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Pre-fill the form when an existing review loads
  useEffect(() => {
    if (enrollment.data?.myReview) {
      setReviewGrade(enrollment.data.myReview.grade)
      setReviewComment(enrollment.data.myReview.comment)
    }
  }, [enrollment.data?.myReview?.id])

  const submitReview = useMutation({
    mutationFn: () => {
      const courseId = enrollment.data!.courseId
      const body = { grade: reviewGrade, comment: reviewComment }
      return enrollment.data!.myReview
        ? api.updateReview(courseId, body)
        : api.createReview(courseId, body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', enrollmentId] })
      qc.invalidateQueries({ queryKey: ['course', enrollment.data!.courseId] })
      setShowReviewForm(false)
    },
  })

  if (enrollment.isPending || lesson.isPending) {
    return <div className="p-8 text-gray-600">Loading…</div>
  }
  if (enrollment.error || lesson.error) {
    return (
      <div className="p-8 text-red-700">
        Failed to load: {((enrollment.error ?? lesson.error) as Error).message}
      </div>
    )
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
        {/* Left */}
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

          {(allDone || e.myReview) && (
            <div className="border-2 border-gray-800 bg-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">
                {e.myReview ? 'Your review' : 'Finished the course?'}
              </h3>
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>{e.myReview ? 'Edit your review' : 'Leave a Review & Rate Course'}</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Grade</label>
                    <select
                      value={reviewGrade}
                      onChange={(ev) => setReviewGrade(Number(ev.target.value))}
                      className="px-3 py-2 border-2 border-gray-800 bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((g) => (
                        <option key={g} value={g}>
                          {'★'.repeat(g)} ({g})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(ev) => setReviewComment(ev.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-gray-800 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitReview.mutate()}
                      disabled={submitReview.isPending}
                      className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {submitReview.isPending ? 'Submitting…' : e.myReview ? 'Save changes' : 'Submit'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewForm(false)
                        if (e.myReview) {
                          setReviewGrade(e.myReview.grade)
                          setReviewComment(e.myReview.comment)
                        }
                      }}
                      className="px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {submitReview.error && (
                    <p className="text-sm text-red-700">{(submitReview.error as Error).message}</p>
                  )}
                </div>
              )}

              {e.myReview && !showReviewForm && (
                <div className="mt-4 p-4 border-2 border-gray-400 bg-white">
                  <div className="text-sm text-gray-600 mb-1">{'★'.repeat(e.myReview.grade)}</div>
                  <p className="text-gray-800 whitespace-pre-wrap">{e.myReview.comment}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white">
            <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
              <h2 className="font-bold text-gray-900">{e.courseTitle}</h2>
            </div>

            <div>
              {sortedLessons.map((x, index) => {
                const done = completedSet.has(x.id)
                const isCurrent = x.id === l.id
                return (
                  <Link
                    key={x.id}
                    to={`/learn/${enrollmentId}/${x.id}`}
                    className={`flex items-center gap-3 p-4 transition-colors ${
                      isCurrent
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
                        <Lock className="w-5 h-5 text-gray-500" />
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
