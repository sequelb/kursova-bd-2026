import { Link } from 'react-router';

export function Dashboard() {
  const recommendedCourses = [
    { id: 1, title: 'Introduction to Web Development', teacher: 'John Smith', price: '$49.99', published: '2026-02-15' },
    { id: 2, title: 'Advanced JavaScript Concepts', teacher: 'Sarah Johnson', price: '$79.99', published: '2026-03-10' },
    { id: 3, title: 'UI/UX Design Fundamentals', teacher: 'Michael Brown', price: '$59.99', published: '2026-01-20' },
  ];

  const enrolledCourses = [
    { id: 1, title: 'React for Beginners', progress: 60 },
    { id: 2, title: 'Python Programming Basics', progress: 35 },
  ];

  return (
    <div className="p-8">
      {/* My Learning Progress Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">My Learning Progress</h2>
        
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="border-2 border-gray-800 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-3">{course.title}</h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full h-4 border-2 border-gray-800 bg-gray-100">
                      <div 
                        className="h-full bg-gray-900" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/lesson-player"
                  className="ml-6 px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  Continue Lesson
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Recommended Courses</h2>
        <p className="text-sm text-gray-600 mb-4">(Algorithmic suggestions)</p>
        
        <div className="grid grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="border-2 border-gray-800 bg-white p-4">
              <div className="w-full h-40 border-2 border-gray-400 bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm">[Image Placeholder]</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Teacher: {course.teacher}</p>
              <p className="text-sm text-gray-600 mb-2">Published: {course.published}</p>
              <p className="font-bold text-gray-900 mb-4">{course.price}</p>
              <Link
                to="/course-details"
                className="block w-full py-2 text-center border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}