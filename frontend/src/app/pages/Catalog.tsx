import { ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { api, type CourseQuery, type EnrollmentListItem } from '../../lib/api'
import { Pagination } from '../components/Pagination'
import { CategoryMultiSelect } from '../components/CategoryMultiSelect'
import { CourseCard } from '../components/CourseCard'

type SortKey = NonNullable<CourseQuery['sort']>

const sortLabels: Record<SortKey, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  price_asc: 'Price ↑',
  price_desc: 'Price ↓',
  rating_desc: 'Rating',
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
      {/* filter bar */}

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

      {/* main content */}
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
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  price={course.price}
                  averageRating={course.averageRating}
                  reviewCount={course.reviewCount}
                  createdAt={course.createdAt}
                  author={course.author}
                  buttonLabel={enrollment ? 'Continue' : 'Details'}
                  overlay={
                    enrollment ? (
                      <div className="absolute -top-4  right-2 px-2 py-1 border-2 border-gray-800 bg-gray-900 text-white text-xs font-bold">
                        Enrolled · {enrollment.progress}%
                      </div>
                    ) : undefined
                  }
                />
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
