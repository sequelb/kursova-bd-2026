import { Star } from 'lucide-react'
import { Link } from 'react-router'
import type { ReactNode } from 'react'

function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i <= Math.round(rating)
          ? 'fill-gray-900 text-gray-900'
          : 'fill-gray-400 text-gray-400'
        }`}
      />,
    )
  }
  return stars
}

interface CourseCardProps {
  id: number
  title: string
  price: number
  averageRating: number
  reviewCount: number
  createdAt: string
  author?: { id: number; firstName: string; lastName: string }
  overlay?: ReactNode
  titleExtra?: ReactNode
  buttonLabel?: string
}

export function CourseCard({
  id,
  title,
  price,
  averageRating,
  reviewCount,
  createdAt,
  author,
  overlay,
  titleExtra,
  buttonLabel = 'Details',
}: CourseCardProps) {
  return (
    <div className="relative border-2 border-gray-800 bg-white p-4 flex flex-col">
      {overlay}
      <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
        <span className="text-gray-500 text-sm">[Image Placeholder]</span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        {titleExtra}
      </div>
      <div className="flex items-center gap-1 mb-2">
        {renderStars(averageRating)}
        <span className="ml-1 text-sm text-gray-600">
          ({averageRating.toFixed(1)}) · {reviewCount}
        </span>
      </div>
      {author && (
        <p className="text-sm text-gray-600 mb-1">
          By{' '}
          <Link
            to={`/authors/${author.id}`}
            onClick={(ev) => ev.stopPropagation()}
            className="text-gray-900 hover:underline"
          >
            {author.firstName} {author.lastName}
          </Link>
        </p>
      )}
      <p className="text-sm text-gray-600 mb-2">
        Published: {new Date(createdAt).toISOString().slice(0, 10)}
      </p>
      <p className="font-bold text-gray-900 mb-4">${price.toFixed(2)}</p>
      <Link
        to={`/courses/${id}`}
        className="block w-full mt-auto py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
      >
        {buttonLabel}
      </Link>
    </div>
  )
}
