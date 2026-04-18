import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { api, type CreateCourseRequest, type LessonEdit } from '../../../lib/api'
import { CategoryMultiSelect } from '../../components/CategoryMultiSelect'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export function CourseEditor() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const isNew = location.pathname.endsWith('/new')
  const courseId = isNew ? null : Number(id)
  const nav = useNavigate()
  const qc = useQueryClient()

  // ---- queries ----
  const course = useQuery({
    queryKey: ['teacher-course', courseId],
    queryFn: () => api.getMyTeacherCourse(courseId!),
    enabled: courseId != null,
  })
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: api.listCategories,
  })

  // ---- form state ----
  const [form, setForm] = useState<CreateCourseRequest>({
    title: '',
    description: '',
    price: 0,
    level: 'Beginner',
    categoryIds: [],
  })
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (course.data) {
      setForm({
        title: course.data.title,
        description: course.data.description,
        price: course.data.price,
        level: course.data.level,
        categoryIds: course.data.categories.map((c) => c.id),
      })
      setDirty(false)
    }
  }, [course.data?.id])

  function patch<K extends keyof CreateCourseRequest>(key: K, value: CreateCourseRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }


  // ---- mutations ----
  const save = useMutation({
    mutationFn: () =>
      isNew ? api.createCourse(form) : api.updateCourse(courseId!, form),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['teacher-courses'] })
      qc.invalidateQueries({ queryKey: ['teacher-course', data.id] })
      qc.invalidateQueries({ queryKey: ['course', data.id] })
      setDirty(false)
      if (isNew) {
        nav(`/teacher/courses/${data.id}/edit`, { replace: true })
      }
    },
  })

  const publish = useMutation({
    mutationFn: () => api.publishCourse(courseId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-courses'] })
      qc.invalidateQueries({ queryKey: ['teacher-course', courseId] })
    },
  })

  const deleteCourse = useMutation({
    mutationFn: () => api.deleteCourse(courseId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-courses'] })
      nav('/teacher/courses', { replace: true })
    },
  })

  function handleDeleteCourse() {
    if (window.confirm('Delete this course? This cannot be undone.')) {
      deleteCourse.mutate()
    }
  }

  if (!isNew && course.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (!isNew && course.error) {
    return <div className="p-8 text-red-700">Failed: {(course.error as Error).message}</div>
  }

  return (
    <div className="p-8 max-w-5xl">
      <Link
        to="/teacher/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Courses
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create New Course' : 'Edit Course'}
        </h1>
        {!isNew && course.data && (
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 border-2 border-gray-800 text-sm font-bold ${
                course.data.status === 'Published'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              {course.data.status}
            </span>
            {course.data.status === 'Draft' && (
              <button
                onClick={() => publish.mutate()}
                disabled={publish.isPending || course.data.lessons.length === 0}
                title={course.data.lessons.length === 0 ? 'Add at least one lesson first' : ''}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {publish.isPending ? 'Publishing…' : 'Publish'}
              </button>
            )}
          </div>
        )}
      </div>

      {publish.error && (
        <p className="mb-4 text-sm text-red-700">{(publish.error as Error).message}</p>
      )}

      {/* Course info form */}
      <section className="mb-8 border-2 border-gray-800 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course details</h2>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-gray-900">Title</span>
            <input
              value={form.title}
              onChange={(e) => patch('title', e.target.value)}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-gray-900">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => patch('description', e.target.value)}
              rows={5}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-bold text-gray-900">Price ($)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => patch('price', Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-gray-900">Level</span>
              <select
                value={form.level}
                onChange={(e) => patch('level', e.target.value)}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="text-sm font-bold text-gray-900 block mb-2">Categories</span>
            <CategoryMultiSelect
              categories={categories.data ?? []}
              selected={form.categoryIds}
              onChange={(ids) => {
                setForm((f) => ({ ...f, categoryIds: ids }))
                setDirty(true)
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => save.mutate()}
            disabled={!dirty || save.isPending || !form.title.trim()}
            className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : isNew ? 'Create course' : 'Save changes'}
          </button>
          {save.isSuccess && !dirty && !isNew && (
            <span className="flex items-center gap-1 text-sm text-green-700 font-bold">
              <Check className="w-4 h-4" />
              Saved
            </span>
          )}
          {save.error && (
            <p className="text-sm text-red-700 ml-2">{(save.error as Error).message}</p>
          )}
        </div>
      </section>

      {/* Lessons */}
      <section className="mb-8 border-2 border-gray-800 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Curriculum</h2>

        {isNew ? (
          <p className="text-gray-600">Save the course first to add lessons.</p>
        ) : course.data ? (
          <LessonsManager courseId={courseId!} lessons={course.data.lessons} />
        ) : null}
      </section>

      {/* Delete course */}
      {!isNew && course.data && (
        <section className="border-2 border-red-700 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-800 mb-2">Delete course</h2>
          <p className="text-sm text-red-800 mb-4">
            Deleting a course is permanent. You can only delete a course that has no enrollments.
          </p>
          <button
            onClick={handleDeleteCourse}
            disabled={deleteCourse.isPending}
            className="px-6 py-2 border-2 border-red-700 bg-white text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {deleteCourse.isPending ? 'Deleting…' : 'Delete course'}
          </button>
          {deleteCourse.error && (
            <p className="mt-2 text-sm text-red-700">{(deleteCourse.error as Error).message}</p>
          )}
        </section>
      )}
    </div>
  )
}

function LessonsManager({ courseId, lessons }: { courseId: number; lessons: LessonEdit[] }) {
  const qc = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)

  const sorted = [...lessons].sort((a, b) => a.orderNumber - b.orderNumber)

  const reorder = useMutation({
    mutationFn: (lessonIds: number[]) => api.reorderLessons(courseId, lessonIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teacher-course', courseId] }),
  })

  function move(index: number, direction: -1 | 1) {
    const next = [...sorted]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    reorder.mutate(next.map((l) => l.id))
  }

  const deleteLesson = useMutation({
    mutationFn: (id: number) => api.deleteLesson(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teacher-course', courseId] }),
  })

  // Clear stale mutation errors whenever the lessons list actually changes —
  // e.g. a delete failed but the user then added/edited/reordered something.
  // Fingerprint covers id, position, title, and content so any edit triggers it.
  useEffect(() => {
    deleteLesson.reset()
    reorder.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons.map((l) => `${l.id}:${l.orderNumber}:${l.title}:${l.content}`).join('|')])

  function handleDelete(lessonId: number) {
    if (window.confirm('Delete this lesson? This cannot be undone.')) {
      deleteLesson.mutate(lessonId)
    }
  }

  return (
    <div className="space-y-3">
      {sorted.length === 0 && !adding && <p className="text-gray-600">No lessons yet.</p>}

      {sorted.map((lesson, i) => (
        <div key={lesson.id} className="border-2 border-gray-400 bg-gray-50">
          {editingId === lesson.id ? (
            <LessonForm
              initial={{ title: lesson.title, content: lesson.content }}
              submitLabel="Save lesson"
              onCancel={() => setEditingId(null)}
              onSubmit={async (body) => {
                await api.updateLesson(lesson.id, body)
                qc.invalidateQueries({ queryKey: ['teacher-course', courseId] })
                setEditingId(null)
              }}
            />
          ) : (
            <div className="flex items-center gap-3 p-3">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || reorder.isPending}
                  title="Move up"
                  className="p-1 border-2 border-gray-800 bg-white hover:bg-gray-200 disabled:opacity-30"
                >
                  <ArrowUp className="w-3 h-3 text-gray-900" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === sorted.length - 1 || reorder.isPending}
                  title="Move down"
                  className="p-1 border-2 border-gray-800 bg-white hover:bg-gray-200 disabled:opacity-30"
                >
                  <ArrowDown className="w-3 h-3 text-gray-900" />
                </button>
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-600">Lesson {lesson.orderNumber}</div>
                <div className="font-bold text-gray-900">{lesson.title}</div>
              </div>

              <button
                onClick={() => setEditingId(lesson.id)}
                title="Edit lesson"
                className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-200"
              >
                <Pencil className="w-4 h-4 text-gray-900" />
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                disabled={deleteLesson.isPending}
                title="Delete lesson"
                className="p-2 border-2 border-gray-800 bg-white hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 text-red-700" />
              </button>
            </div>
          )}
        </div>
      ))}

      {deleteLesson.error && (
        <p className="text-sm text-red-700">{(deleteLesson.error as Error).message}</p>
      )}
      {reorder.error && (
        <p className="text-sm text-red-700">{(reorder.error as Error).message}</p>
      )}

      {adding ? (
        <LessonForm
          initial={{ title: '', content: '' }}
          submitLabel="Add lesson"
          onCancel={() => setAdding(false)}
          onSubmit={async (body) => {
            await api.addLesson(courseId, body)
            qc.invalidateQueries({ queryKey: ['teacher-course', courseId] })
            setAdding(false)
          }}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add lesson
        </button>
      )}
    </div>
  )
}

function LessonForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: { title: string; content: string }
  submitLabel: string
  onSubmit: (body: { title: string; content: string }) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial.title)
  const [content, setContent] = useState(initial.content)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ title: title.trim(), content })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 space-y-3">
      <label className="block">
        <span className="text-sm font-bold text-gray-900">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-gray-900">Content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim()}
          className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        {error && <p className="text-sm text-red-700 ml-2">{error}</p>}
      </div>
    </div>
  )
}
