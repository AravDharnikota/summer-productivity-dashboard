import { todayString } from '../lib/dates'
import DayRings from '../components/today/DayRings'
import ScheduleTimeline from '../components/today/ScheduleTimeline'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'
import NightCheckin from '../components/today/NightCheckin'

interface Props { date?: string }

export default function Today({ date = todayString() }: Props) {
  return (
    <div className="today-page">
      <DayRings date={date} />
      <div className="two-col gap-bottom">
        <ScheduleTimeline date={date} />
        <div className="stack">
          <MissionCard date={date} />
          <ProtocolCard date={date} />
        </div>
      </div>
      <NightCheckin date={date} />
    </div>
  )
}
