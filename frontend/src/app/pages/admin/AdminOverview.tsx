import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '../../../lib/useDebounce'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../../../lib/api'

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function daysAgo(n: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - n)
  return isoDate(d)
}

function today() {
  return isoDate(new Date())
}

const PRESETS: { label: string; from: () => string; to: () => string }[] = [
  { label: 'Last 7 days', from: () => daysAgo(6), to: today },
  { label: 'Last 30 days', from: () => daysAgo(29), to: today },
  { label: 'Last 90 days', from: () => daysAgo(89), to: today },
  { label: 'Last 365 days', from: () => daysAgo(364), to: today },
]

export function AdminOverview() {
  const [from, setFrom] = useState(daysAgo(29))
  const [to, setTo] = useState(today())
  const debouncedFrom = useDebounce(from)
  const debouncedTo = useDebounce(to)

  const dashboard = useQuery({
    queryKey: ['admin-finance-dashboard', debouncedFrom, debouncedTo],
    queryFn: () => api.getAdminFinanceDashboard(debouncedFrom, debouncedTo),
  })

  const chartData = useMemo(() => {
    if (!dashboard.data) return []
    const rev = dashboard.data.revenueTimeline
    const pay = dashboard.data.payoutsTimeline
    const days = rev.length
    // Pick a bucket size based on range length so the chart never has too many points.
    // ≤60 days → daily, ≤365 days → weekly (7), >365 days → monthly (~30).
    const bucketDays = days <= 60 ? 1 : days <= 365 ? 7 : 30
    // For ranges > 1 year, show YYYY-MM; for shorter ranges, MM-DD is enough.
    const labelFn = (dateStr: string) =>
      bucketDays >= 30 ? dateStr.slice(0, 7) : dateStr.slice(5, 10)

    if (bucketDays === 1) {
      return rev.map((r, i) => ({
        label: labelFn(r.date),
        revenue: Math.round(r.amount * 100) / 100,
        payouts: Math.round((pay[i]?.amount ?? 0) * 100) / 100,
      }))
    }
    const buckets: { label: string; revenue: number; payouts: number }[] = []
    for (let i = 0; i < days; i += bucketDays) {
      let revSum = 0
      let paySum = 0
      const end = Math.min(i + bucketDays, days)
      for (let j = i; j < end; j++) {
        revSum += rev[j].amount
        paySum += pay[j]?.amount ?? 0
      }
      buckets.push({
        label: labelFn(rev[i].date),
        revenue: Math.round(revSum * 100) / 100,
        payouts: Math.round(paySum * 100) / 100,
      })
    }
    return buckets
  }, [dashboard.data])

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Financial Dashboard</h1>

      {/* Date range picker */}
      <div className="border-2 border-gray-800 bg-white p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-900">Date range:</span>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 border-2 border-gray-800 bg-white"
          />
          <span className="text-gray-700">—</span>
          <input
            type="date"
            value={to}
            min={from}
            max={today()}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 border-2 border-gray-800 bg-white"
          />
          <div className="ml-auto flex items-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setFrom(p.from())
                  setTo(p.to())
                }}
                className="px-3 py-1 border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-200 text-sm transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {dashboard.isPending && <p className="text-gray-600">Loading…</p>}
      {dashboard.error && (
        <p className="text-red-700">Failed: {(dashboard.error as Error).message}</p>
      )}

      {dashboard.data && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="border-2 border-gray-800 bg-white p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">
                ${dashboard.data.grossRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Gross Revenue</div>
            </div>
            <div className="border-2 border-gray-800 bg-white p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">
                ${dashboard.data.totalRefunds.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Refunds</div>
            </div>
            <div className="border-2 border-gray-800 bg-white p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">
                ${dashboard.data.paidToTeachers.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Paid to Teachers</div>
            </div>
            <div className="border-2 border-gray-800 bg-white p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">
                ${dashboard.data.pendingPayoutsAmount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Pending Payouts ({dashboard.data.pendingPayoutsCount})
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="border-2 border-gray-800 bg-white mb-8">
            <div className="border-b-2 border-gray-800 bg-gray-100 p-4 font-bold text-gray-900">
              Revenue vs Payouts ({from} → {to})
            </div>
            <div className="p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                  <XAxis
                    dataKey="label"
                    stroke="#374151"
                    tick={{ fontSize: 11 }}
                    interval={Math.max(0, Math.floor(chartData.length / 15))}
                  />
                  <YAxis stroke="#374151" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="payouts"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          {dashboard.data.pendingPayoutsCount > 0 && (
            <div className="border-2 border-gray-800 bg-gray-100 p-4">
              <h2 className="font-bold text-gray-900 mb-2">System Alerts</h2>
              <Link to="/admin/payouts" className="text-gray-900 underline">
                {dashboard.data.pendingPayoutsCount} pending payout
                {dashboard.data.pendingPayoutsCount === 1 ? '' : 's'} awaiting review →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
