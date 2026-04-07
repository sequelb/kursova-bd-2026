import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../lib/auth'

export function TeacherProfile() {
  const { user } = useAuth()
  const profile = useQuery({
    queryKey: ['my-teacher-profile'],
    queryFn: api.getMyTeacherProfile,
  })
  const qc = useQueryClient()

  const [bio, setBio] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (profile.data) {
      setBio(profile.data.bio)
      setDirty(false)
    }
  }, [profile.data?.bio])

  const save = useMutation({
    mutationFn: () => api.updateMyTeacherProfile(bio),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-teacher-profile'] })
      // also invalidate the public author endpoint for this teacher, if cached
      if (user) qc.invalidateQueries({ queryKey: ['author', user.id] })
      setDirty(false)
    },
  })

  if (profile.isPending) return <div className="p-8 text-gray-600">Loading…</div>
  if (profile.error) {
    return <div className="p-8 text-red-700">Failed: {(profile.error as Error).message}</div>
  }
  if (!profile.data || !user) return null

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="border-2 border-gray-800 bg-white p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Name</div>
            <div className="font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Email</div>
            <div className="font-bold text-gray-900">{user.email}</div>
          </div>
          <div>
            <div className="text-gray-600">Role</div>
            <div className="font-bold text-gray-900">{user.role}</div>
          </div>
          <div>
            <div className="text-gray-600">Current balance</div>
            <div className="font-bold text-gray-900">${profile.data.balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-800 bg-white p-6">
        <label className="block">
          <span className="text-sm font-bold text-gray-900">Bio</span>
          <p className="text-sm text-gray-600 mb-2">
            This is shown on your public author page and on the course detail pages of courses you've authored.
          </p>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
              setDirty(true)
            }}
            rows={6}
            className="w-full px-3 py-2 border-2 border-gray-800 bg-white"
            placeholder="Tell students about yourself…"
          />
        </label>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => save.mutate()}
            disabled={!dirty || save.isPending}
            className="px-6 py-2 border-2 border-gray-800 bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save changes'}
          </button>
          {dirty && (
            <button
              onClick={() => {
                setBio(profile.data!.bio)
                setDirty(false)
              }}
              className="px-6 py-2 border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Discard
            </button>
          )}
          {save.isSuccess && !dirty && (
            <span className="flex items-center gap-1 text-sm text-green-700 font-bold">
              <Check className="w-4 h-4" />
              Saved
            </span>
          )}
          {save.error && (
            <p className="text-sm text-red-700 ml-2">{(save.error as Error).message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
