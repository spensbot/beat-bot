import { useAppState } from "@/redux/hooks"
import cn from "@/utils/cn"
import { selectSessionEval } from "./selectSessionEval"

export default function StatsView() {
  const stats = useAppState(selectSessionEval)
  if (!stats) return null

  return (
    <div>
      <Stat
        name="Matches"
        value={stats.matches.length.toString()}
        color="#fff"
      />
      {/* <Stat name="Extra Presses" value={stats.extraPresses.size.toString()} />
      <Stat name="Missed Notes" value={stats.missedNotes.size.toString()} /> */}
      <Stat
        name="Deviation"
        value={`${(stats.delta_stdDev_s * 1000).toFixed(1)}ms`}
        color="#fff"
      />
      <Stat
        name={stats.delta_avg_s < 0 ? "Leading" : "Lagging"}
        value={`${(stats.delta_avg_s * 1000).toFixed(1)}ms`}
        color="#fff"
      />
    </div>
  )
}

const Stat = ({
  value,
  name,
  color,
}: {
  name: string
  value: string
  color: string
}) => (
  <div>
    <strong className={cn(color, "text-3xl")}>{value}</strong> {name}
  </div>
)
