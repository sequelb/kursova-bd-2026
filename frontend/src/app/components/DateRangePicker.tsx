import { useState } from 'react'
import { useDebounce } from '../../lib/useDebounce'

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}
function daysAgo(n: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - n)
  return isoDate(d)
}
function todayStr() {
  return isoDate(new Date())
}

const PRESETS = [
  { label: '7d', from: () => daysAgo(6), to: todayStr },
  { label: '30d', from: () => daysAgo(29), to: todayStr },
  { label: '90d', from: () => daysAgo(89), to: todayStr },
  { label: '1y', from: () => daysAgo(364), to: todayStr },
]

type Props = {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

export function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="date"
        value={from}
        min="2010-01-01"
        max={to}
        onChange={(e) => {
          if (e.target.value >= '2010-01-01') onChange(e.target.value, to)
        }}
        className="px-3 py-1 border-2 border-gray-800 bg-white text-sm"
      />
      <span className="text-gray-700">—</span>
      <input
        type="date"
        value={to}
        min={from}
        max={todayStr()}
        onChange={(e) => {
          if (e.target.value >= '2010-01-01') onChange(from, e.target.value)
        }}
        className="px-3 py-1 border-2 border-gray-800 bg-white text-sm"
      />
      <div className="flex items-center gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.from(), p.to())}
            className="px-2 py-1 border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-200 text-xs transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** hook that wraps DateRangePicker state with debouncing for queries. */
export function useDateRange(defaultDays = 29) {
  const [from, setFrom] = useState(daysAgo(defaultDays))
  const [to, setTo] = useState(todayStr())
  const debouncedFrom = useDebounce(from)
  const debouncedTo = useDebounce(to)

  function onChange(f: string, t: string) {
    setFrom(f)
    setTo(t)
  }

  return {
    from,
    to,
    debouncedFrom,
    debouncedTo,
    onChange,
  }
}
