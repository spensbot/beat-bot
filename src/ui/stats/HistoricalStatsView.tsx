import { useAppState } from "@/redux/hooks"
import { sum } from "@/utils/listUtils"

export function HistoricalStatsView() {
  const sessionStatsByLoopId = useAppState((s) => s.sessionStatsByLoopId)

  const nMatches = Object.values(sessionStatsByLoopId).reduce(
    (acc, stats) => acc + sum(stats, (s) => s.nMatches),
    0
  )

  return (
    <div>
      <p>All time matches: {nMatches}</p>
    </div>
  )
}
