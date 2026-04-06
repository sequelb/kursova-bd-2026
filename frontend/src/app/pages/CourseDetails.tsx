import { Play, Clock, Award, CheckCircle, BarChart } from 'lucide-react';
import { BookOpen, FileText } from 'lucide-react';

export function CourseDetails() {
  const lessons = [
    'Lesson 1: Introduction to Advanced Concepts',
    'Lesson 2: Closures and Scope',
    'Lesson 3: Async/Await and Promises',
    'Lesson 4: ES6+ Features',
  ];

  const reviews = [
    {
      id: 1,
      author: 'John Doe',
      date: '5 days ago',
      text: 'This course was excellent! I learned so much about JavaScript and the instructor explained everything clearly. Highly recommend to anyone looking to improve their skills.',
    },
    {
      id: 2,
      author: 'Jane Smith',
      date: '2 weeks ago',
      text: 'Great content and well-structured lessons. The examples were practical and easy to follow. Would definitely take more courses from this instructor.',
    },
  ];

  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* Left Column - 70% */}
        <div className="flex-[7]">
          {/* Course Title */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Advanced JavaScript Concepts</h1>
          
          {/* Categories */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Categories:</span>
            <span className="px-3 py-1 border-2 border-gray-400 bg-gray-100 text-gray-900 text-sm">
              Programming
            </span>
            <span className="px-3 py-1 border-2 border-gray-400 bg-gray-100 text-gray-900 text-sm">
              JavaScript
            </span>
            <span className="px-3 py-1 border-2 border-gray-400 bg-gray-100 text-gray-900 text-sm">
              Web Development
            </span>
          </div>
          
          {/* Text-based Lesson Preview */}
          <div className="w-full border-2 border-gray-800 bg-white p-8 mb-8">
            <div className="text-center mb-4">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-2" />
              <span className="text-gray-500 text-lg">[Text-based Lesson Preview]</span>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="border-2 border-gray-400 bg-white p-6">
              <p className="text-gray-700 mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-700 mb-3">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-gray-700">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
              </p>
            </div>
          </section>

          {/* Curriculum */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h2>
            <div className="border-2 border-gray-800 bg-white">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className={`p-4 hover:bg-gray-100 transition-colors ${
                    index < lessons.length - 1 ? 'border-b-2 border-gray-400' : ''
                  }`}
                >
                  <span className="text-gray-900">{lesson}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Student Reviews */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-2 border-gray-400 bg-white p-6">
                  <div className="mb-2">
                    <span className="font-bold text-gray-900">{review.author}</span>
                    <span className="text-gray-600 text-sm ml-2">- {review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - 30% */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white p-6">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">$79.99</div>
            </div>

            {/* Course Stats */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Duration: 8 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Level: Intermediate</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Format: Text-based</span>
              </div>
            </div>

            {/* Pay & Enroll Button */}
            <button className="w-full py-4 mb-6 border-2 border-gray-800 bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition-colors">
              Pay & Enroll
            </button>

            {/* Additional Info */}
            <div className="border-t-2 border-gray-400 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Certificate of completion</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Lifetime access</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">30-day money back</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}