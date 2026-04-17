import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Pagination } from '../../components/Pagination'

export function FinancialControls() {
  const [status, setStatus] = useState<'all' | 'Completed' | 'Refunded'>('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const payments = useQuery({
    queryKey: ['admin-payments', status, q, page],
    queryFn: () => api.listAdminPayments(status === 'all' ? undefined : status, q || undefined, page),
  })

  const refund = useMutation({
    mutationFn: (id: number) => api.refundPayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-payments'] })
      qc.invalidateQueries({ queryKey: ['admin-finance-dashboard'] })
    },
  })

  function handleRefund(id: number) {
    if (
      window.confirm(
        'Issue a refund for this payment? The student will lose access to the course and their lesson progress will be deleted.',
      )
    ) {
      refund.mutate(id)
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Student Payments &amp; Refunds</h1>

      {/* Filters */}
      <div className="border-2 border-gray-800 bg-white p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-gray-900">Status:</span>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as 'all' | 'Completed' | 'Refunded'); setPage(1) }}
          className="px-3 py-2 border-2 border-gray-800 bg-white"
        >
          <option value="all">All</option>
          <option value="Completed">Completed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search by student or course…"
          className="flex-1 min-w-[200px] px-3 py-2 border-2 border-gray-800 bg-white"
        />
      </div>

      {payments.isPending && <p className="text-gray-600">Loading…</p>}
      {payments.error && (
        <p className="text-red-700">Failed: {(payments.error as Error).message}</p>
      )}
      {payments.data && payments.data.items.length === 0 && (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          No payments match your filters.
        </div>
      )}

      {payments.data && payments.data.items.length > 0 && (
        <div className="border-2 border-gray-800 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-900">ID</th>
                <th className="text-left p-3 font-bold text-gray-900">Date</th>
                <th className="text-left p-3 font-bold text-gray-900">Student</th>
                <th className="text-left p-3 font-bold text-gray-900">Course</th>
                <th className="text-left p-3 font-bold text-gray-900">Amount</th>
                <th className="text-left p-3 font-bold text-gray-900">Status</th>
                <th className="text-left p-3 font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.data.items.map((p) => (
                <tr key={p.id} className="border-b border-gray-300 last:border-b-0">
                  <td className="p-3 text-gray-700">TXN-{String(p.id).padStart(5, '0')}</td>
                  <td className="p-3 text-gray-700">
                    {new Date(p.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3 text-gray-900">{p.studentName}</td>
                  <td className="p-3 text-gray-900">{p.courseTitle}</td>
                  <td className="p-3 text-gray-900 font-bold">${p.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 border-2 border-gray-800 text-sm font-bold ${
                        p.status === 'Completed'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="min-w-[120px]">
                      {p.status === 'Completed' && (
                        <button
                          onClick={() => handleRefund(p.id)}
                          disabled={refund.isPending}
                          className="px-3 py-1 border-2 border-gray-800 bg-white text-gray-900 hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                        >
                          Issue Refund
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

      {payments.data && (
        <Pagination page={page} pageSize={20} totalCount={payments.data.totalCount} onPageChange={setPage} />
      )}

      {refund.error && (
        <p className="mt-4 text-sm text-red-700">{(refund.error as Error).message}</p>
      )}
    </div>
  )
}
