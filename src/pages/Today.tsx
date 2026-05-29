import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'

export default function Today() {
  return (
    <div className="today-page">
      <StatRow />
      <div className="two-col gap-bottom">
        <ScheduleCard />
        <div className="stack">
          <MissionCard />
          <ProtocolCard />
        </div>
      </div>
    </div>
  )
}
