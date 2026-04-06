export function CourseEditor() {
  const lessons = [
    { id: 1, title: 'Lesson 1: Introduction to Advanced Concepts' },
    { id: 2, title: 'Lesson 2: Closures and Scope' },
    { id: 3, title: 'Lesson 3: Async/Await and Promises' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Course & Lesson Editor</h1>

      <div className="flex gap-8">
        {/* Left Column - 70% */}
        <div className="flex-[7]">
          {/* Course Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Course Title
            </label>
            <input
              type="text"
              defaultValue="Advanced JavaScript Concepts"
              className="w-full px-4 py-2 border-2 border-gray-800 bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Category
            </label>
            <select
              defaultValue="programming"
              className="w-full px-4 py-2 border-2 border-gray-800 bg-white"
            >
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Course Description */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Course Description
            </label>
            <textarea
              rows={6}
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.&#10;&#10;Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              className="w-full px-4 py-2 border-2 border-gray-800 bg-white resize-none"
            />
          </div>

          {/* Curriculum Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h2>
            
            <div className="border-2 border-gray-800 bg-white mb-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 ${
                    index < lessons.length - 1 ? 'border-b-2 border-gray-400' : ''
                  }`}
                >
                  <span className="text-gray-900">{lesson.title}</span>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-900 hover:underline text-sm">
                      Edit
                    </button>
                    <button className="text-gray-900 hover:underline text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-6 py-3 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors">
              Add New Text Lesson
            </button>
          </section>
        </div>

        {/* Right Column - 30% */}
        <div className="flex-[3]">
          <div className="sticky top-8 border-2 border-gray-800 bg-white p-6">
            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                defaultValue="79.99"
                className="w-full px-4 py-2 border-2 border-gray-800 bg-white"
              />
            </div>

            {/* Level */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Level
              </label>
              <select
                defaultValue="intermediate"
                className="w-full px-4 py-2 border-2 border-gray-800 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Save Button */}
            <button className="w-full py-4 border-2 border-gray-800 bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition-colors">
              Save Course Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
