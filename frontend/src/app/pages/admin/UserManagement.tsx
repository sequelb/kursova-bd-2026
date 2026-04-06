export function UserManagement() {
  const users = [
    { id: 'U-001', name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Student', status: 'Active' },
    { id: 'U-002', name: 'John Smith', email: 'john.smith@email.com', role: 'Teacher', status: 'Active' },
    { id: 'U-003', name: 'Michael Brown', email: 'michael.b@email.com', role: 'Student', status: 'Active' },
    { id: 'U-004', name: 'Jane Williams', email: 'jane.w@email.com', role: 'Teacher', status: 'Suspended' },
    { id: 'U-005', name: 'Emily Davis', email: 'emily.d@email.com', role: 'Student', status: 'Active' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors">
          Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full px-4 py-2 border-2 border-gray-800 bg-white"
        />
      </div>

      {/* Users Table */}
      <div className="border-2 border-gray-800 bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-gray-100 border-b-2 border-gray-800">
          <div className="px-6 py-4 font-bold text-gray-900">User ID</div>
          <div className="px-6 py-4 font-bold text-gray-900">Name</div>
          <div className="px-6 py-4 font-bold text-gray-900">Email</div>
          <div className="px-6 py-4 font-bold text-gray-900">Role</div>
          <div className="px-6 py-4 font-bold text-gray-900">Status</div>
          <div className="px-6 py-4 font-bold text-gray-900">Actions</div>
        </div>

        {/* Table Rows */}
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`grid grid-cols-6 ${
              index < users.length - 1 ? 'border-b-2 border-gray-400' : ''
            }`}
          >
            <div className="px-6 py-4 text-gray-900">{user.id}</div>
            <div className="px-6 py-4 text-gray-900">{user.name}</div>
            <div className="px-6 py-4 text-gray-900">{user.email}</div>
            <div className="px-6 py-4 text-gray-900">{user.role}</div>
            <div className="px-6 py-4">
              <span
                className={`px-3 py-1 border-2 ${
                  user.status === 'Active'
                    ? 'border-gray-800 bg-gray-900 text-white'
                    : 'border-gray-400 bg-gray-100 text-gray-900'
                }`}
              >
                {user.status}
              </span>
            </div>
            <div className="px-6 py-4 flex gap-2">
              <button className="text-gray-900 hover:underline text-sm">
                Edit
              </button>
              <button className="text-gray-900 hover:underline text-sm">
                {user.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
