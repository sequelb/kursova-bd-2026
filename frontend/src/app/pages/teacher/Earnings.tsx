export function Earnings() {
  const payoutHistory = [
    { id: 'PO-001', date: '2026-03-01', amount: '450.00', status: 'Completed' },
    { id: 'PO-002', date: '2026-02-15', amount: '320.50', status: 'Completed' },
    { id: 'PO-003', date: '2026-02-01', amount: '580.00', status: 'Completed' },
    { id: 'PO-004', date: '2026-01-28', amount: '225.00', status: 'Pending' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Earnings & Payouts</h1>

      {/* Available Balance Section */}
      <div className="border-2 border-gray-800 bg-white p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Available Balance</h2>
            <div className="text-5xl font-bold text-gray-900">$1,250.00</div>
          </div>
          <button className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors">
            Request Payout
          </button>
        </div>
      </div>

      {/* Payout History Table */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payout History</h2>
        
        <div className="border-2 border-gray-800 bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-gray-100 border-b-2 border-gray-800">
            <div className="px-6 py-4 font-bold text-gray-900">Payout ID</div>
            <div className="px-6 py-4 font-bold text-gray-900">Date</div>
            <div className="px-6 py-4 font-bold text-gray-900">Amount ($)</div>
            <div className="px-6 py-4 font-bold text-gray-900">Status</div>
          </div>

          {/* Table Rows */}
          {payoutHistory.map((payout, index) => (
            <div
              key={payout.id}
              className={`grid grid-cols-4 ${
                index < payoutHistory.length - 1 ? 'border-b-2 border-gray-400' : ''
              }`}
            >
              <div className="px-6 py-4 text-gray-900">{payout.id}</div>
              <div className="px-6 py-4 text-gray-900">{payout.date}</div>
              <div className="px-6 py-4 text-gray-900">${payout.amount}</div>
              <div className="px-6 py-4">
                <span
                  className={`px-3 py-1 border-2 ${
                    payout.status === 'Completed'
                      ? 'border-gray-800 bg-gray-900 text-white'
                      : 'border-gray-400 bg-gray-100 text-gray-900'
                  }`}
                >
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
