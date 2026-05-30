import CalendarGrid from '../components/calendar/CalendarGrid'

export default function Calendar() {
  return (
    <div className="card">
      <div className="card-title">Summer Lock-In Calendar</div>
      <div className="card-sub">May 30 → Aug 14, 2026 · 77 days</div>

      <div className="cal-legend">
        <span>
          <span className="legend-swatch" style={{ background: 'var(--red-bg)', border: '1px solid #2a1010' }} />
          Off Day
        </span>
        <span>
          <span className="legend-swatch" style={{ background: 'var(--indigo-bg)', border: '1px solid var(--indigo-border)' }} />
          Hackathon
        </span>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>
          Green border = Day 1 &amp; Day 77
        </span>
      </div>

      <CalendarGrid year={2026} month={4} />
      <CalendarGrid year={2026} month={5} />
      <CalendarGrid year={2026} month={6} />
      <CalendarGrid year={2026} month={7} />
    </div>
  )
}
