import StatRow from '../components/today/StatRow'
import ScheduleCard from '../components/today/ScheduleCard'
import MissionCard from '../components/today/MissionCard'
import ProtocolCard from '../components/today/ProtocolCard'
import AcademicsCard from '../components/today/AcademicsCard'
import BuildCard from '../components/today/BuildCard'
import GoalCascade from '../components/today/GoalCascade'
import FitnessCard from '../components/today/FitnessCard'
import MindCard from '../components/today/MindCard'

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
      <div className="two-col gap-bottom">
        <AcademicsCard />
        <BuildCard />
      </div>
      <GoalCascade />
      <div className="two-col gap-bottom">
        <FitnessCard />
        <MindCard />
      </div>
    </div>
  )
}
