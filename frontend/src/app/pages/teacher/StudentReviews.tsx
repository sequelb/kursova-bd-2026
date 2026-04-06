import { Star } from 'lucide-react';

export function StudentReviews() {
  const reviews = [
    {
      id: 1,
      rating: 5,
      studentName: 'John Doe',
      courseTitle: 'Advanced JavaScript Concepts',
      text: 'This course was excellent! I learned so much about JavaScript and the instructor explained everything clearly. Highly recommend to anyone looking to improve their skills.',
    },
    {
      id: 2,
      rating: 4,
      studentName: 'Jane Smith',
      courseTitle: 'React for Beginners',
      text: 'Great content and well-structured lessons. The examples were practical and easy to follow. Would definitely take more courses from this instructor.',
    },
    {
      id: 3,
      rating: 5,
      studentName: 'Michael Brown',
      courseTitle: 'Python Programming Basics',
      text: 'Amazing course! The instructor has a great teaching style and the content is very comprehensive. I feel much more confident in my Python skills now.',
    },
    {
      id: 4,
      rating: 4,
      studentName: 'Sarah Johnson',
      courseTitle: 'UI/UX Design Fundamentals',
      text: 'Very informative and practical. The real-world examples helped me understand the concepts better. Looking forward to applying what I learned in my projects.',
    },
  ];

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Student Reviews</h1>
        <div className="w-96">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Select Course to view reviews
          </label>
          <select className="w-full px-4 py-2 border-2 border-gray-800 bg-white">
            <option value="all">All Courses</option>
            <option value="course1">Advanced JavaScript Concepts</option>
            <option value="course2">React for Beginners</option>
            <option value="course3">Python Programming Basics</option>
            <option value="course4">UI/UX Design Fundamentals</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-2 border-gray-800 bg-white p-6">
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? 'fill-gray-900 text-gray-900'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Student Name & Course */}
            <div className="mb-3">
              <span className="font-bold text-gray-900">{review.studentName}</span>
              <span className="text-gray-600 text-sm ml-2">- {review.courseTitle}</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 mb-3">{review.text}</p>

            {/* Reply Link */}
            <button className="text-gray-900 hover:underline text-sm">
              Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
