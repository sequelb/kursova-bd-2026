import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type AdminUser } from '../../../lib/api'
import { useAuth } from '../../../lib/auth'
import { Pagination } from '../../components/Pagination'

export function UserManagement() {
  const { user: currentUser } = useAuth()
  const [role, setRole] = useState<'all' | AdminUser['role']>('all')
  const [status, setStatus] = useState<'all' | AdminUser['status']>('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const users = useQuery({
    queryKey: ['admin-users', role, status, q, page],
    queryFn: () =>
      api.listAdminUsers({
        role: role === 'all' ? undefined : role,
        status: status === 'all' ? undefined : status,
        q: q || undefined,
        page,
      }),
  })

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'Active' | 'Suspended' }) =>
      api.updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  function toggle(u: AdminUser) {
    const next = u.status === 'Active' ? 'Suspended' : 'Active'
    if (next === 'Suspended') {
      if (
        !window.confirm(
          `Suspend ${u.firstName} ${u.lastName}? They will be logged out and unable to sign in until reactivated.`,
        )
      )
        return
    }
    update.mutate({ id: u.id, status: next })
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">User Management</h1>

      {/* Filters */}
      <div className="border-2 border-gray-800 bg-white p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-gray-900">Role:</span>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as 'all' | AdminUser['role']); setPage(1) }}
          className="px-3 py-2 border-2 border-gray-800 bg-white"
        >
          <option value="all">All</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>

        <span className="text-sm font-bold text-gray-900 ml-3">Status:</span>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as 'all' | AdminUser['status']); setPage(1) }}
          className="px-3 py-2 border-2 border-gray-800 bg-white"
        >
          <option value="all">All</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>

        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search by name or email…"
          className="flex-1 min-w-[200px] px-3 py-2 border-2 border-gray-800 bg-white"
        />
      </div>

      {users.isPending && <p className="text-gray-600">Loading…</p>}
      {users.error && <p className="text-red-700">Failed: {(users.error as Error).message}</p>}
      {users.data && users.data.items.length === 0 && (
        <div className="border-2 border-gray-400 bg-white p-8 text-center text-gray-600">
          No users match your filters.
        </div>
      )}

      {users.data && users.data.items.length > 0 && (
        <div className="border-2 border-gray-800 bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-900 w-[10%]">User ID</th>
                <th className="text-left p-3 font-bold text-gray-900 w-[18%]">Name</th>
                <th className="text-left p-3 font-bold text-gray-900 w-[30%]">Email</th>
                <th className="text-left p-3 font-bold text-gray-900 w-[10%]">Role</th>
                <th className="text-left p-3 font-bold text-gray-900 w-[12%]">Status</th>
                <th className="text-left p-3 font-bold text-gray-900 w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.items.map((u) => {
                const isSelf = currentUser?.id === u.id
                const isAdmin = u.role === 'Admin'
                const disabled = isSelf || isAdmin || update.isPending
                return (
                  <tr key={u.id} className="border-b border-gray-300 last:border-b-0">
                    <td className="p-3 text-gray-700">U-{String(u.id).padStart(4, '0')}</td>
                    <td className="p-3 text-gray-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3 text-gray-700">{u.email}</td>
                    <td className="p-3 text-gray-900">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-3 py-1 border-2 border-gray-800 text-sm font-bold ${
                          u.status === 'Active'
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggle(u)}
                        disabled={disabled}
                        title={
                          isSelf
                            ? "You can't change your own status"
                            : isAdmin
                              ? "Admin accounts can't be suspended"
                              : ''
                        }
                        className="px-3 py-1 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {users.data && (
        <Pagination page={page} pageSize={20} totalCount={users.data.totalCount} onPageChange={setPage} />
      )}

      {update.error && (
        <p className="mt-4 text-sm text-red-700">{(update.error as Error).message}</p>
      )}
    </div>
  )
}
