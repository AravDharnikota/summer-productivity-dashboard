interface Props {
  pct: number
  label: string
  value: string
  color: string
  size?: number
}

export default function RingProgress({ label, value, color }: Props) {
  return (
    <div className="ring-wrap">
      <div className="ring-center-val" style={{ color }}>{value}</div>
      <div className="ring-label">{label}</div>
    </div>
  )
}
