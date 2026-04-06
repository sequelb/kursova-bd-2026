export function AdminOverview() {
  const kpis = [
    { label: 'Gross Revenue', value: '$124,580' },
    { label: 'Total Refunds', value: '$3,240' },
    { label: 'Paid to Teachers', value: '$87,206' },
    { label: 'Platform Net Profit', value: '$34,134' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border-2 border-gray-800 bg-white p-6">
            <div className="text-sm font-bold text-gray-700 mb-2">{kpi.label}</div>
            <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="border-2 border-gray-800 bg-white mb-8">
        <div className="border-b-2 border-gray-800 bg-gray-100 px-6 py-3">
          <h2 className="font-bold text-gray-900">Revenue vs Payouts (30 Days)</h2>
        </div>
        <div className="p-6">
          <div className="h-80 border-2 border-gray-400 bg-gray-50 flex items-center justify-center">
            <span className="text-gray-500">[Bar Chart: Revenue vs Payouts Over Time]</span>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="border-2 border-gray-800 bg-white">
        <div className="border-b-2 border-gray-800 bg-gray-100 px-6 py-3">
          <h2 className="font-bold text-gray-900">System Alerts</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900">5 pending payout requests</p>
        </div>
      </div>
    </div>
  );
}
