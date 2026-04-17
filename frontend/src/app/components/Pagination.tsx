import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, totalCount, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  // Show at most 5 page buttons centered around the current page.
  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)

  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing {from}–{to} of {totalCount}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 border-2 border-gray-400 bg-white hover:bg-gray-200 transition-colors text-sm"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-gray-500">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border-2 text-sm transition-colors ${
              p === page
                ? 'border-gray-800 bg-gray-900 text-white'
                : 'border-gray-400 bg-white hover:bg-gray-200 text-gray-900'
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-gray-500">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 border-2 border-gray-400 bg-white hover:bg-gray-200 transition-colors text-sm"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
