import { Award, CheckCircle, BarChart, BookOpen, FileText, Pencil, Star, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const nav = useNavigate()
  const qc = useQueryClient()
  const [searchParams] = useSearchParams()

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

  const enrollmentDetail = useQuery({
    queryKey: ['enrollment', existingEnrollment?.id],
    queryFn: () => api.getEnrollment(existingEnrollment!.id),
    enabled: !!existingEnrollment,
  })

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

  // ---- review form state ----
  const myReview = enrollmentDetail.data?.myReview ?? null
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewGrade, setReviewGrade] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    if (myReview) {
      setReviewGrade(myReview.grade)
      setReviewComment(myReview.comment)
    }
  }, [myReview?.id])

  // Smart-banner: ?review=open auto-opens the form and scrolls to it.
  useEffect(() => {
    if (searchParams.get('review') === 'open' && enrollmentDetail.data) {
      setShowReviewForm(true)
      setTimeout(() => {
        document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('review'), enrollmentDetail.data?.id])

  const submitReview = useMutation({
    mutationFn: () => {
      const body = { grade: reviewGrade, comment: reviewComment }
      return myReview ? api.updateReview(courseId, body) : api.createReview(courseId, body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', existingEnrollment?.id] })
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      setShowReviewForm(false)
    },
  })

  const deleteReview = useMutation({
    mutationFn: () => api.deleteReview(courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', existingEnrollment?.id] })
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      setShowReviewForm(false)
      setReviewGrade(5)
      setReviewComment('')
    },
  })

  function handleDeleteReview() {
    if (window.confirm('Delete your review? This cannot be undone.')) {
      deleteReview.mutate()
    }
  }

  if (course.isPending || enrollments.isPending) {
    return <div className="p-8 text-gray-600">Loading…</div>
  }
  if (course.error) {
    return <div className="p-8 text-red-700">Failed: {(course.error as Error).message}</div>
  }
  if (!course.data) return null

  const c = course.data
  const isFinished = existingEnrollment && existingEnrollment.progress >= 100

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

          <div className="text-sm text-gray-700 mb-3">
            By{' '}
            <Link
              to={`/authors/${c.author.id}`}
              className="font-bold text-gray-900 hover:underline"
            >
              {c.author.firstName} {c.author.lastName}
            </Link>
          </div>

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

          {/* Your review section — only for enrolled students */}
          {existingEnrollment && (
            <section id="review-section" className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Review</h2>

              {/* Has a review */}
              {myReview && !showReviewForm && (
                <div className="border-2 border-gray-800 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">
                        {'★'.repeat(myReview.grade)}{'☆'.repeat(5 - myReview.grade)}
                        {' · '}
                        {new Date(myReview.createdAt).toISOString().slice(0, 10)}
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{myReview.comment}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => setShowReviewForm(true)}
                        title="Edit review"
                        className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={handleDeleteReview}
                        disabled={deleteReview.isPending}
                        title="Delete review"
                        className="p-2 border-2 border-gray-800 bg-white hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-700" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* No review yet, finished or not — show CTA */}
              {!myReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>Leave a Review & Rate Course</span>
                </button>
              )}

              {/* Form */}
              {showReviewForm && (
                <div className="border-2 border-gray-800 bg-gray-100 p-6 space-y-3">
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
                      {submitReview.isPending ? 'Submitting…' : myReview ? 'Save changes' : 'Submit'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewForm(false)
                        if (myReview) {
                          setReviewGrade(myReview.grade)
                          setReviewComment(myReview.comment)
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
            </section>
          )}

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
              isFinished ? (
                <div className="mb-6">
                  <div className="w-full py-4 mb-3 border-2 border-gray-800 bg-white text-gray-900 text-lg font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Course Completed</span>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="w-full py-2 border-2 border-gray-400 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Re-open lessons
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleContinue}
                  className="w-full py-4 mb-6 border-2 border-gray-800 bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition-colors"
                >
                  Continue Learning ({existingEnrollment.progress}%)
                </button>
              )
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
