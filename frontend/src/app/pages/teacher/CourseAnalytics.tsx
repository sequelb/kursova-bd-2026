import { Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export function CourseAnalytics() {
  const kpiCards = [
    { label: 'Total Enrolled', value: '120' },
    { label: 'Course Revenue', value: '$9,500' },
    { label: 'Average Rating', value: '4.8 ★' },
    { label: 'Completion Rate', value: '65%' },
  ];

  const recentStudents = [
    { name: 'Sarah Johnson', enrollmentDate: '2026-03-15', progress: 85 },
    { name: 'Michael Chen', enrollmentDate: '2026-03-20', progress: 42 },
    { name: 'Emily Rodriguez', enrollmentDate: '2026-03-28', progress: 18 },
  ];

  const studentReviews = [
    {
      id: 1,
      studentName: 'David Wilson',
      rating: 5,
      date: '2026-04-01',
      comment: 'Excellent course! The content is well-structured and easy to follow. The instructor explains complex concepts in a simple way.',
    },
    {
      id: 2,
      studentName: 'Jennifer Martinez',
      rating: 4,
      date: '2026-03-28',
      comment: 'Great course overall. The practical examples were very helpful. Would have liked more advanced topics covered.',
    },
    {
      id: 3,
      studentName: 'Robert Kim',
      rating: 5,
      date: '2026-03-25',
      comment: 'This course exceeded my expectations. Clear explanations and comprehensive coverage of JavaScript concepts.',
    },
  ];

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="mb-6">
        <Link
          to="/teacher/courses"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Courses</span>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics: Advanced JavaScript Concepts
          </h1>
          <Link
            to="/teacher/course-editor"
            className="px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
          >
            Edit Course
          </Link>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="border-2 border-gray-800 bg-white p-6 flex flex-col items-center justify-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {card.value}
            </div>
            <div className="text-sm text-gray-600 text-center">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Enrollments Chart */}
      <div className="border-2 border-gray-800 bg-white mb-8">
        <div className="border-b-2 border-gray-800 bg-gray-100 px-6 py-3">
          <h2 className="font-bold text-gray-900">Enrollments (Last 30 Days)</h2>
        </div>
        <div className="p-6">
          <div className="h-64 border-2 border-gray-400 bg-gray-50 flex items-center justify-center">
            <span className="text-gray-500">[Line Chart: Enrollments Over Time]</span>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="border-2 border-gray-800 bg-white mb-8">
        <div className="border-b-2 border-gray-800 bg-gray-100 px-6 py-3">
          <h2 className="font-bold text-gray-900">Recent Students</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-800 bg-gray-50">
              <th className="text-left px-6 py-3 font-bold text-gray-900">
                Student Name
              </th>
              <th className="text-left px-6 py-3 font-bold text-gray-900">
                Enrollment Date
              </th>
              <th className="text-left px-6 py-3 font-bold text-gray-900">
                Current Progress (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((student, index) => (
              <tr
                key={index}
                className={index !== recentStudents.length - 1 ? 'border-b border-gray-400' : ''}
              >
                <td className="px-6 py-4 text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-gray-700">{student.enrollmentDate}</td>
                <td className="px-6 py-4 text-gray-900">{student.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Reviews */}
      <div className="border-2 border-gray-800 bg-white">
        <div className="border-b-2 border-gray-800 bg-gray-100 px-6 py-3">
          <h2 className="font-bold text-gray-900">Student Reviews</h2>
        </div>
        <div className="divide-y-2 divide-gray-400">
          {studentReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900 mb-1">{review.studentName}</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-gray-900 text-gray-900'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{review.date}</div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
