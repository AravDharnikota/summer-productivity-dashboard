import { useEffect, useState } from 'react'

interface Props {
  pct: number
  label: string
  value: string
  color: string
  size?: number
}

export default function RingProgress({ pct, label, value, color, size = 110 }: Props) {
  const [drawn, setDrawn] = useState(0)

  useEffect(() => {
    setDrawn(0)
    const t = setTimeout(() => setDrawn(Math.min(pct, 100)), 120)
    return () => clearTimeout(t)
  }, [pct])

  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * drawn) / 100

  return (
    <div className="ring-wrap">
      <div className="ring-svg-outer" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1d1d1d" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="ring-center-val">{value}</div>
      </div>
      <div className="ring-label">{label}</div>
    </div>
  )
}
