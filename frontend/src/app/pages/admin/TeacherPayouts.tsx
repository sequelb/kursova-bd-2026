import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type AdminPayout } from '../../../lib/api'

const STATUSES: AdminPayout['status'][] = ['Pending', 'Approved', 'Rejected', 'Paid']

const statusBadge: Record<AdminPayout['status'], string> = {
  Pending: 'bg-white text-gray-900 border-gray-800',
  Approved: 'bg-gray-200 text-gray-900 border-gray-800',
  Paid: 'bg-gray-900 text-white border-gray-800',
  Rejected: 'bg-red-100 text-red-700 border-red-700',
}

export function TeacherPayouts() {
  const [filter, setFilter] = useState<'all' | AdminPayout['status']>('all')
  const qc = useQueryClient()

  const payouts = useQuery({
    queryKey: ['admin-payouts', filter],
    queryFn: () => api.listAdminPayouts(filter === 'all' ? undefined : filter),
  })

  function invalidateAll() {
    qc.invalidateQueries({ queryKey: ['admin-payouts'] })
    qc.invalidateQueries({ queryKey: ['admin-finance-dashboard'] })
  }

  const approve = useMutation({
    mutationFn: (id: number) => api.approvePayout(id),
    onSuccess: invalidateAll,
  })
  const reject = useMutation({
    mutationFn: (id: number) => api.rejectPayout(id),
    onSuccess: invalidateAll,
  })
  const markPaid = useMutation({
    mutationFn: (id: number) => api.markPayoutPaid(id),
    onSuccess: invalidateAll,
  })

  const anyError = approve.error ?? reject.error ?? markPaid.error

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Teacher Payout Requests</h1>

      <div className="border-2 border-gray-800 bg-white p-4 mb-6 flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900">Status:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | AdminPayout['status'])}
          className="px-3 py-2 border-2 border-gray-800 bg-white"
        >
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {payouts.isPending && <p className="text-gray-600">Loading…</p>}
      {payouts.error && (
        <p className="text-red-700">Failed: {(payouts.error as Error).message}</p>
      )}
      {payouts.data && payouts.data.length === 0 && (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          No payout requests.
        </div>
      )}

      {payouts.data && payouts.data.length > 0 && (
        <div className="border-2 border-gray-800 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-900">Request Date</th>
                <th className="text-left p-3 font-bold text-gray-900">Teacher</th>
                <th className="text-left p-3 font-bold text-gray-900">Amount</th>
                <th className="text-left p-3 font-bold text-gray-900">Status</th>
                <th className="text-left p-3 font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.data.map((p) => (
                <tr key={p.id} className="border-b border-gray-300 last:border-b-0">
                  <td className="p-3 text-gray-700">
                    {new Date(p.requestedAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3 text-gray-900">{p.teacherName}</td>
                  <td className="p-3 text-gray-900 font-bold">${p.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 border-2 text-sm font-bold ${statusBadge[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 min-w-[180px]">
                      {p.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => approve.mutate(p.id)}
                            disabled={approve.isPending}
                            className="px-3 py-1 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject.mutate(p.id)}
                            disabled={reject.isPending}
                            className="px-3 py-1 border-2 border-gray-800 bg-white text-gray-900 hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {p.status === 'Approved' && (
                        <button
                          onClick={() => markPaid.mutate(p.id)}
                          disabled={markPaid.isPending}
                          className="px-3 py-1 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {anyError && (
        <p className="mt-4 text-sm text-red-700">{(anyError as Error).message}</p>
      )}
    </div>
  )
}
