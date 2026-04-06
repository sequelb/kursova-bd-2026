import { Play, ChevronLeft, ChevronRight, CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';
import { FileText } from 'lucide-react';

export function LessonPlayer() {
  const lessons = [
    { id: 1, title: 'Lesson 1: Introduction', status: 'completed' },
    { id: 2, title: 'Lesson 2: Core Concepts', status: 'completed' },
    { id: 3, title: 'Lesson 3: Advanced Topics', status: 'playing' },
    { id: 4, title: 'Lesson 4: Practical Examples', status: 'locked' },
    { id: 5, title: 'Lesson 5: Final Project', status: 'locked' },
  ];

  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* Left Area - 70% */}
        <div className="flex-[7]">
          {/* Text Content Area */}
          <div className="w-full border-2 border-gray-800 bg-white p-8 mb-6">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-2" />
              <span className="text-gray-500 text-lg">[Text-based Lesson Content]</span>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                architecto beatae vitae dicta sunt explicabo.
              </p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </div>

          {/* Lesson Title */}
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Lesson 3: Advanced Topics</h1>
          
          {/* Description */}
          <div className="border-2 border-gray-400 bg-white p-6 mb-6">
            <p className="text-gray-700 mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-700">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Lesson</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors">
              <span>Next Lesson</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Leave a Review Button */}
          <div className="border-2 border-gray-800 bg-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Finished the course?</h3>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              <Star className="w-5 h-5" />
              <span>Leave a Review & Rate Course</span>
            </button>
          </div>
        </div>

        {/* Right Area - 30% */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white">
            {/* Course Content Header */}
            <div className="border-b-2 border-gray-800 bg-gray-100 p-4">
              <h2 className="font-bold text-gray-900">Course Content</h2>
            </div>

            {/* Lessons List */}
            <div>
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-4 transition-colors ${
                    lesson.status === 'playing'
                      ? 'bg-gray-200 border-l-4 border-l-gray-900'
                      : 'hover:bg-gray-50'
                  } ${index < lessons.length - 1 ? 'border-b-2 border-gray-400' : ''}`}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {lesson.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-gray-900" />
                    )}
                    {lesson.status === 'playing' && (
                      <FileText className="w-5 h-5 text-gray-900" />
                    )}
                    {lesson.status === 'locked' && (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  {/* Lesson Title */}
                  <span
                    className={`text-sm ${
                      lesson.status === 'locked' ? 'text-gray-500' : 'text-gray-900'
                    } ${lesson.status === 'playing' ? 'font-bold' : ''}`}
                  >
                    {lesson.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Summary */}
            <div className="border-t-2 border-gray-800 bg-gray-100 p-4">
              <div className="text-sm text-gray-700 mb-2">Course Progress</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 border-2 border-gray-800 bg-gray-100">
                  <div className="h-full bg-gray-900" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-bold text-gray-900">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}