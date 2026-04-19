import { ChevronDown, Star } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { api, type CourseQuery, type EnrollmentListItem } from '../../lib/api'
import { Pagination } from '../components/Pagination'
import { CategoryMultiSelect } from '../components/CategoryMultiSelect'

type SortKey = NonNullable<CourseQuery['sort']>

const sortLabels: Record<SortKey, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  price_asc: 'Price ↑',
  price_desc: 'Price ↓',
  rating_desc: 'Rating',
}

function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= Math.round(rating)
            ? 'fill-gray-900 text-gray-900'
            : 'fill-gray-400 text-gray-400'
        }`}
      />,
    )
  }
  return stars
}

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL is the source of truth for filters
  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') as SortKey | null) ?? 'newest'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minRating = searchParams.get('minRating')
  const categoryIds = searchParams.getAll('categoryIds').map(Number)
  const page = Number(searchParams.get('page') ?? '1') || 1

  const query: CourseQuery = useMemo(
    () => ({
      q: q || undefined,
      sort,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      page,
      pageSize: 12,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams.toString() captures all params as one stable string
    [searchParams.toString()],
  )

  const courses = useQuery({
    queryKey: ['courses', query],
    queryFn: () => api.listCourses(query),
  })
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: api.listCategories,
  })
  const enrollments = useQuery({
    queryKey: ['enrollments'],
    queryFn: api.listMyEnrollments,
  })
  const enrollmentByCourseId = useMemo(() => {
    const map = new Map<number, EnrollmentListItem>()
    for (const e of enrollments.data ?? []) map.set(e.courseId, e)
    return map
  }, [enrollments.data])

  const [showFilters, setShowFilters] = useState(false)

  function patchParams(patch: Record<string, string | string[] | null>) {
    const next = new URLSearchParams(searchParams)
    for (const [k, v] of Object.entries(patch)) {
      next.delete(k)
      if (v == null) continue
      if (Array.isArray(v)) for (const x of v) next.append(k, x)
      else if (v !== '') next.set(k, v)
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors"
          >
            <span>Filters</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-700">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => patchParams({ sort: e.target.value })}
              className="px-4 py-2 border-2 border-gray-800 bg-white"
            >
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {sortLabels[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-3 gap-6 border-t-2 border-gray-400 pt-4">
            <div>
              <div className="text-sm font-bold text-gray-900 mb-2">Categories</div>
              <CategoryMultiSelect
                categories={categories.data ?? []}
                selected={categoryIds}
                onChange={(ids) =>
                  patchParams({ categoryIds: ids.length ? ids.map(String) : null })
                }
              />
            </div>

            <div>
              <div className="text-sm font-bold text-gray-900 mb-2">Price ($)</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minPrice ?? ''}
                  onChange={(e) => patchParams({ minPrice: e.target.value || null })}
                  className="w-24 px-2 py-1 border-2 border-gray-800 bg-white"
                />
                <span>—</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxPrice ?? ''}
                  onChange={(e) => patchParams({ maxPrice: e.target.value || null })}
                  className="w-24 px-2 py-1 border-2 border-gray-800 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-gray-900 mb-2">Min rating</div>
              <select
                value={minRating ?? ''}
                onChange={(e) => patchParams({ minRating: e.target.value || null })}
                className="px-3 py-1 border-2 border-gray-800 bg-white"
              >
                <option value="">Any</option>
                <option value="1">★ 1+</option>
                <option value="2">★ 2+</option>
                <option value="3">★ 3+</option>
                <option value="4">★ 4+</option>
                <option value="5">★ 5</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Course Catalog</h1>

        {courses.isPending && <p className="text-gray-600">Loading…</p>}
        {courses.error && (
          <div className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-700">Failed to load courses: {(courses.error as Error).message}</div>
        )}
        {courses.data && courses.data.items.length === 0 && (
          <p className="text-gray-600">No courses match your filters.</p>
        )}

        {courses.data && courses.data.items.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {courses.data.items.map((course) => {
              const enrollment = enrollmentByCourseId.get(course.id)
              return (
                <div key={course.id} className="relative border-2 border-gray-800 bg-white p-4 flex flex-col">
                  {enrollment && (
                    <div className="absolute top-2 right-2 px-2 py-1 border-2 border-gray-800 bg-gray-900 text-white text-xs font-bold">
                      Enrolled · {enrollment.progress}%
                    </div>
                  )}
                  <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-sm">[Image Placeholder]</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(course.averageRating)}
                    <span className="ml-1 text-sm text-gray-600">
                      ({course.averageRating.toFixed(1)}) · {course.reviewCount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    By{' '}
                    <Link
                      to={`/authors/${course.author.id}`}
                      onClick={(ev) => ev.stopPropagation()}
                      className="text-gray-900 hover:underline"
                    >
                      {course.author.firstName} {course.author.lastName}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Published: {new Date(course.createdAt).toISOString().slice(0, 10)}
                  </p>
                  <p className="font-bold text-gray-900 mb-4">${course.price.toFixed(2)}</p>
                  <Link
                    to={`/courses/${course.id}`}
                    className="block w-full mt-auto py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                  >
                    {enrollment ? 'Continue' : 'Details'}
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {courses.data && (
          <Pagination
            page={page}
            pageSize={12}
            totalCount={courses.data.totalCount}
            onPageChange={(p) => patchParams({ page: p === 1 ? null : String(p) })}
          />
        )}
      </div>
    </div>
  )
}
