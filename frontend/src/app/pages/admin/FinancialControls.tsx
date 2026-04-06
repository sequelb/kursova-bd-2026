export function FinancialControls() {
  const transactions = [
    { id: 'TXN-10234', date: '2026-04-03', student: 'Sarah Johnson', course: 'Advanced JavaScript Concepts', amount: '79.99', status: 'Completed' },
    { id: 'TXN-10233', date: '2026-04-02', student: 'Michael Brown', course: 'React for Beginners', amount: '59.99', status: 'Completed' },
    { id: 'TXN-10232', date: '2026-04-01', student: 'Emily Davis', course: 'Python Programming Basics', amount: '89.99', status: 'Refunded' },
    { id: 'TXN-10231', date: '2026-03-31', student: 'Robert Kim', course: 'UI/UX Design Fundamentals', amount: '69.99', status: 'Completed' },
  ];

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Payments & Refunds</h1>
        <select className="px-4 py-2 border-2 border-gray-800 bg-white">
          <option>Filter by Status</option>
          <option>Completed</option>
          <option>Refunded</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="border-2 border-gray-800 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-800 bg-gray-100">
              <th className="text-left px-6 py-4 font-bold text-gray-900">Transaction ID</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Date</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Student</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Course</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Amount</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Status</th>
              <th className="text-left px-6 py-4 font-bold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={index < transactions.length - 1 ? 'border-b-2 border-gray-400' : ''}
              >
                <td className="px-6 py-4 text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 text-gray-700">{transaction.date}</td>
                <td className="px-6 py-4 text-gray-900">{transaction.student}</td>
                <td className="px-6 py-4 text-gray-700">{transaction.course}</td>
                <td className="px-6 py-4 text-gray-900">${transaction.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 border-2 text-sm ${
                      transaction.status === 'Completed'
                        ? 'border-gray-800 bg-gray-900 text-white'
                        : 'border-gray-400 bg-gray-100 text-gray-900'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {transaction.status === 'Completed' && (
                    <button className="px-4 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors text-sm">
                      Issue Refund
                    </button>
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
