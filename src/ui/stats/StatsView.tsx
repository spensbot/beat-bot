import { useAppState } from "@/redux/hooks"
import cn from "@/utils/cn"
import { selectSessionEval } from "./selectSessionEval"
import { getSessionStats } from "@/engine/loop/SessionEval"

export default function StatsView() {
  const eval_ = useAppState(selectSessionEval)
  const stats = eval_ ? getSessionStats(eval_) : null

  const mistakes = stats?.nMistakes.toString() ?? "-"
  const matches = stats?.nMatches.toString() ?? "-"
  const deviation = stats
    ? `${(stats.delta_stdDev_s * 1000).toFixed(1)}ms`
    : "-"
  const deltaAvg = stats ? `${(stats.delta_avg_s * 1000).toFixed(1)}ms` : "-"
  const deltaText =
    stats === null ? "" : stats.delta_avg_s < 0 ? "Early" : "Late"
  const deviationPct = stats
    ? `${(stats.delta_stdDev_ratio * 100).toFixed(1)}%`
    : "-"
  const score = stats ? `${(stats.score * 100).toFixed(0)}%` : "-"
  const nTargets = stats?.nTargets.toString() ?? "-"

  return (
    <div className="flex flex-col gap-1 w-50">
      <Stat name="Targets" value={nTargets} />
      <Stat name="Mistakes" value={mistakes} />
      <Stat name="Matches" value={matches} />
      <Stat name="Deviation" value={deviation} value2={deviationPct} />
      <Stat name={deltaText} value={deltaAvg} />
      <Stat name="Score" value={`${score}`} />
    </div>
  )
}

const Stat = ({
  value,
  value2,
  name,
  color = "#fff",
}: {
  name: string
  value: string
  value2?: string
  color?: string
}) => (
  <div>
    <div className="flex gap-4">
      <strong className={cn(color, "text-3xl")}>{value}</strong>
      {value2 && <strong className={cn(color, "text-3xl")}>{value2}</strong>}
    </div>
    <p className="text-neutral-500">{name}</p>
  </div>
)
