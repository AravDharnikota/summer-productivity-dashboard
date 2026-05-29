import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'

export default function Today() {
  return (
    <div className="today-page">
      <StatRow />
      <div className="two-col gap-bottom">
        <ScheduleCard />
        <div className="stack">
          <div className="card" style={{ color: 'var(--text-muted)' }}>Mission — coming in Task 8</div>
          <div className="card" style={{ color: 'var(--text-muted)' }}>Protocol — coming in Task 8</div>
        </div>
      </div>
    </div>
  )
}
