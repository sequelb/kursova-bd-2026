import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type PayoutHistoryItem } from '../../../lib/api'

const statusBadge: Record<PayoutHistoryItem['status'], string> = {
  Pending: 'bg-white text-gray-900',
  Approved: 'bg-gray-200 text-gray-900',
  Paid: 'bg-gray-900 text-white',
  Rejected: 'bg-red-100 text-red-700 border-red-700',
}

export function Earnings() {
  const earnings = useQuery({
    queryKey: ['earnings'],
    queryFn: api.getEarnings,
  })
  const qc = useQueryClient()

  const [requesting, setRequesting] = useState(false)
  const [amount, setAmount] = useState('')

  const request = useMutation({
    mutationFn: () => api.requestPayout(Number(amount)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['earnings'] })
      setRequesting(false)
      setAmount('')
    },
  })

  if (earnings.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (earnings.error) {
    return <div className="p-8 text-red-700">Failed: {(earnings.error as Error).message}</div>
  }
  if (!earnings.data) return null

  const e = earnings.data
  const parsedAmount = Number(amount)
  const validAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 && parsedAmount <= e.balance

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Earnings & Payouts</h1>

      {/* Balance card */}
      <div
        className={`border-2 p-6 mb-8 ${
          e.balance < 0 ? 'border-red-700 bg-red-50' : 'border-gray-800 bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Available Balance</div>
            <div
              className={`text-4xl font-bold mt-1 ${
                e.balance < 0 ? 'text-red-700' : 'text-gray-900'
              }`}
            >
              ${e.balance.toFixed(2)}
            </div>
            {e.balance < 0 && (
              <p className="text-sm text-red-700 mt-2 max-w-md">
                You owe the platform ${Math.abs(e.balance).toFixed(2)}. This happens when a
                student is refunded after you've already been paid out for their enrollment.
                The deficit will be cleared as you earn from new enrollments. New payouts are
                disabled until your balance is positive.
              </p>
            )}
          </div>
          {!requesting && (
            <button
              onClick={() => setRequesting(true)}
              disabled={e.balance <= 0}
              className="px-6 py-3 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Request Payout
            </button>
          )}
        </div>

        {requesting && (
          <div className="mt-6 border-t-2 border-gray-400 pt-6 space-y-3">
            <h3 className="font-bold text-gray-900">Request a payout</h3>
            <label className="block">
              <span className="text-sm font-bold text-gray-900">Amount ($)</span>
              <input
                type="number"
                min={0.01}
                max={e.balance}
                step="0.01"
                value={amount}
                onChange={(ev) => setAmount(ev.target.value)}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-800 bg-white"
                autoFocus
              />
              <p className="text-sm text-gray-600 mt-1">
                Maximum: ${e.balance.toFixed(2)}
              </p>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => request.mutate()}
                disabled={!validAmount || request.isPending}
                className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {request.isPending ? 'Submitting…' : 'Submit request'}
              </button>
              <button
                onClick={() => {
                  setRequesting(false)
                  setAmount('')
                }}
                className="px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              {request.error && (
                <p className="text-sm text-red-700 ml-2">{(request.error as Error).message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payout history */}
      <div className="border-2 border-gray-800 bg-white">
        <div className="border-b-2 border-gray-800 bg-gray-100 p-4 font-bold text-gray-900">
          Payout History
        </div>
        {e.history.length === 0 ? (
          <div className="p-4 text-gray-600">No payout requests yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-900">Payout ID</th>
                <th className="text-left p-3 font-bold text-gray-900">Date</th>
                <th className="text-left p-3 font-bold text-gray-900">Amount</th>
                <th className="text-left p-3 font-bold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {e.history.map((p) => (
                <tr key={p.id} className="border-b border-gray-300 last:border-b-0">
                  <td className="p-3 text-gray-700">PO-{String(p.id).padStart(4, '0')}</td>
                  <td className="p-3 text-gray-700">
                    {new Date(p.requestedAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3 text-gray-900 font-bold">${p.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 border-2 border-gray-800 text-xs font-bold ${statusBadge[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
