import { useAppState } from "@/redux/hooks"
import cn from "@/utils/cn"
import { selectSessionEval } from "./selectSessionEval"
import { emptySessionEval } from "@/engine/loop/SessionEval"

export default function StatsView() {
  const stats = useAppState(selectSessionEval)

  const matches = stats?.matches.length.toString() ?? "-"
  const deviation = stats
    ? `${(stats.delta_stdDev_s * 1000).toFixed(1)}ms`
    : "-"
  const deltaAvg = stats ? `${(stats.delta_avg_s * 1000).toFixed(1)}ms` : "-"
  const deltaText =
    stats === undefined ? "" : stats.delta_avg_s < 0 ? "Early" : "Late"

  return (
    <div className="flex flex-col gap-1 w-50">
      <Stat name="Matches" value={matches} color="#fff" />
      {/* <Stat name="Extra Presses" value={stats.extraPresses.size.toString()} />
      <Stat name="Missed Notes" value={stats.missedNotes.size.toString()} /> */}
      <Stat name="Deviation" value={`${deviation}`} color="#fff" />
      <Stat name={deltaText} value={`${deltaAvg}`} color="#fff" />
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
    <strong className={cn(color, "text-3xl")}>{value}</strong>
    <p className="text-neutral-500">{name}</p>
  </div>
)
