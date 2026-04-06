import { Star } from 'lucide-react';
import { Link } from 'react-router';

export function TeacherDashboard() {
  const courses = [
    {
      id: 1,
      title: 'Advanced JavaScript Concepts',
      enrolledStudents: 120,
      averageRating: 4.8,
      created: '2026-03-10',
    },
    {
      id: 2,
      title: 'React for Beginners',
      enrolledStudents: 85,
      averageRating: 4.6,
      created: '2026-02-20',
    },
    {
      id: 3,
      title: 'Python Programming Basics',
      enrolledStudents: 200,
      averageRating: 4.9,
      created: '2026-01-15',
    },
    {
      id: 4,
      title: 'UI/UX Design Fundamentals',
      enrolledStudents: 150,
      averageRating: 4.7,
      created: '2026-01-20',
    },
  ];

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage My Courses</h1>
        <Link
          to="/teacher/course-editor"
          className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          Create New Course
        </Link>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border-2 border-gray-800 bg-white">
            {/* Image Placeholder */}
            <div className="w-full h-40 border-b-2 border-gray-800 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[Course Image]</span>
            </div>

            {/* Course Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">{course.title}</h3>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  Created: {course.created}
                </div>
                <div className="text-sm text-gray-700">
                  Enrolled Students: {course.enrolledStudents}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Average Rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(course.averageRating)
                            ? 'fill-gray-900 text-gray-900'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-bold text-gray-900 ml-1">
                      {course.averageRating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/teacher/course-analytics"
                  className="block w-full py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  View Analytics
                </Link>
                <Link
                  to="/teacher/course-editor"
                  className="block w-full py-2 text-center border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  Edit Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
