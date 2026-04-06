import { ChevronDown, Star } from 'lucide-react';
import { Link } from 'react-router';

export function Catalog() {
  const courses = [
    { id: 1, title: 'Introduction to Web Development', rating: 4.0, price: '$49.99', published: '2026-02-15' },
    { id: 2, title: 'Advanced JavaScript Concepts', rating: 5.0, price: '$79.99', published: '2026-03-10' },
    { id: 3, title: 'UI/UX Design Fundamentals', rating: 4.5, price: '$59.99', published: '2026-01-20' },
    { id: 4, title: 'Python for Data Science', rating: 4.2, price: '$89.99', published: '2026-02-28' },
    { id: 5, title: 'Mobile App Development', rating: 4.8, price: '$69.99', published: '2026-03-05' },
    { id: 6, title: 'Database Management Systems', rating: 3.5, price: '$54.99', published: '2026-01-12' },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(rating)
              ? 'fill-gray-900 text-gray-900'
              : 'fill-gray-400 text-gray-400'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors">
            <span>Category</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors">
            <span>Rating</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors">
            <span>Price</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-700">Sort by:</span>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-200 transition-colors">
              <span>Relevance</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Course Catalog</h1>
        
        {/* Course Grid */}
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border-2 border-gray-800 bg-white p-4">
              <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm">[Image Placeholder]</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(course.rating)}
                <span className="ml-1 text-sm text-gray-600">({course.rating})</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Published: {course.published}</p>
              <p className="font-bold text-gray-900 mb-4">{course.price}</p>
              <Link
                to="/course-details"
                className="block w-full py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
