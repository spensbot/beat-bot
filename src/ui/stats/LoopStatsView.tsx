import { PASSING_SCORE, SessionStats_t } from "@/engine/loop/SessionStats"
import { useAppState } from "@/redux/hooks"
import { sum } from "@/utils/listUtils"
import { Stats } from "@/utils/Stats"

export function LoopStatsView({ loopId }: { loopId: string }) {
  const stats: SessionStats_t[] | undefined = useAppState(
    (s) => s.sessionStatsByLoopId[loopId]
  )

  if (!stats) return null

  const renderStats: StatProps[] = [
    // { label: "Total Matches", value: sum(stats, (s) => s.nMatches) },
    // { label: "Average Score", value: Stats.mean(stats.map((s) => s.score)) },
    {
      label: "Highest Passing BPM (>90%)",
      value: Stats.max(
        stats.filter((s) => s.score > PASSING_SCORE).map((s) => s.bpm)
      ),
    },
    // {
    //   label: "Average Variance",
    //   value: `${Stats.mean(stats.map((s) => s.delta_stdDev_ratio))}%`,
    // },
    // {
    //   label: "Velocity Std Dev",
    //   value: Stats.stdDev(stats.map((s) => s.velocity_avg)),
    // },
  ]

  return (
    <div>
      {renderStats.map((stat) => (
        <Stat key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  )
}

interface StatProps {
  label: string
  value: string | number
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="stat">
      <span className="label">{label}: </span>
      <span className="value">{value}</span>
    </div>
  )
}
