import OverviewStatRow from '../components/overview/OverviewStatRow'
import GoalProgressCard from '../components/overview/GoalProgressCard'
import MonkModeCard from '../components/overview/MonkModeCard'
import MilestonesCard from '../components/overview/MilestonesCard'
import Heatmap from '../components/overview/Heatmap'

export default function Overview() {
  return (
    <div>
      <OverviewStatRow />
      <div className="two-col-wide gap-bottom">
        <GoalProgressCard />
        <div className="stack">
          <MonkModeCard />
          <MilestonesCard />
        </div>
      </div>
      <Heatmap />
    </div>
  )
}
