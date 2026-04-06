export function TeacherPayouts() {
  const payoutRequests = [
    { requestDate: '2026-04-02', teacherName: 'John Smith', amount: '1,245.00', status: 'Pending' },
    { requestDate: '2026-03-28', teacherName: 'Jane Williams', amount: '890.50', status: 'Paid' },
    { requestDate: '2026-04-01', teacherName: 'Michael Chen', amount: '2,150.75', status: 'Pending' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Teacher Payout Requests</h1>

      {/* Payout Requests Table */}
      <div className="border-2 border-gray-800 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-800 bg-gray-100">
              <th className="text-left px-6 py-4 font-bold text-gray-900">Request Date</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Teacher Name</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Amount ($)</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Status</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {payoutRequests.map((request, index) => (
              <tr
                key={index}
                className={index < payoutRequests.length - 1 ? 'border-b-2 border-gray-400' : ''}
              >
                <td className="px-6 py-4 text-gray-900">{request.requestDate}</td>
                <td className="px-6 py-4 text-gray-900">{request.teacherName}</td>
                <td className="px-6 py-4 text-gray-900">${request.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 border-2 text-sm ${
                      request.status === 'Pending'
                        ? 'border-gray-800 bg-white text-gray-900'
                        : 'border-gray-800 bg-gray-900 text-white'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {request.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm">
                        Approve
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors text-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
