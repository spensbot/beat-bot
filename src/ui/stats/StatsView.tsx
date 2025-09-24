import { useAppState } from "@/redux/hooks"
import { selectSessionEval } from "./selectSessionEval"
import { getSessionStats } from "@/engine/session/SessionStats"
import { HistoricalStatsView } from "./HistoricalStatsView"
import { Stat, gap, pun, val, color } from "./Stat"
import TooltipWrapper from "../tooltips/TooltipWrapper"

export default function StatsView() {
  const eval_ = useAppState(selectSessionEval)
  const statsSettings = useAppState((s) => s.stats)
  const stats = eval_ ? getSessionStats(eval_, statsSettings) : null

  if (stats === null)
    return (
      <Wrapper>
        <p className="text-neutral-500">Hit Play to see Session Stats</p>
      </Wrapper>
    )

  const isLate = stats ? stats.delta_avg_s > 0 : false

  return (
    <Wrapper>
      {Stat(
        [
          val(
            Math.floor(stats.score * 100).toFixed(0),
            2.5,
            getScoreColor(stats.score)
          ),
          // pun("%", 2),
        ],
        "Score"
      )}
      {Stat(
        [
          pun("±", 1.5),
          val(
            (stats.delta_stdDev_ratio * 100).toFixed(1),
            2,
            getDevationRatioColor(stats.delta_stdDev_ratio)
          ),
          pun("%  ", 1.5),
          gap(0.3),
          pun("(", 1),
          val(
            (stats.delta_stdDev_s * 1000).toFixed(1),
            1,
            "gray" // getDeviationMsColor(stats.delta_stdDev_s * 1000)
          ),
          pun("ms)", 1),
        ],
        "Deviation"
      )}
      {Stat(
        [
          pun(isLate ? "+" : "-", 1.2),
          val(
            Math.abs(stats.delta_avg_s * 1000).toFixed(1),
            1.5,
            getDeviationMsColor(Math.abs(stats.delta_avg_s * 1000))
          ),
          pun("ms", 1.2),
        ],
        isLate ? "Late" : "Early"
      )}
      {Stat([val(stats.nMistakes.toString(), 1.5, "white")], "Mistakes")}
      {Stat(
        [
          pun("±", 1.2),
          val((stats.velocity_stdDev * 100).toFixed(0), 1.5, "white"),
          pun("%", 1.2),
        ],
        "Velocity"
      )}
      {/* <Stat name="Targets" value={nTargets} /> */}
      {/* <Stat name="Matches" value={matches} /> */}
      <HistoricalStatsView />
    </Wrapper>
  )
}

export function getScoreColor(score: number) {
  if (score >= 0.9) return color(1)
  if (score >= 0.8) return color(0.7)
  if (score >= 0.7) return color(0.5)
  if (score >= 0.6) return color(0.3)
  return color(0)
}

export function getDeviationMsColor(ms: number) {
  if (ms <= 10) return color(1)
  if (ms <= 15) return color(0.9)
  if (ms <= 20) return color(0.8)
  if (ms <= 25) return color(0.6)
  if (ms <= 30) return color(0.5)
  if (ms <= 40) return color(0.3)
  return color(0)
}

export function getDevationRatioColor(ratio: number) {
  if (ratio <= 0.05) return color(1)
  if (ratio <= 0.1) return color(0.9)
  if (ratio <= 0.15) return color(0.8)
  if (ratio <= 0.2) return color(0.6)
  if (ratio <= 0.3) return color(0.5)
  if (ratio <= 0.4) return color(0.3)
  return color(0)
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <TooltipWrapper tooltip="session-stats">
      <div className="flex flex-col gap-2 w-50 rounded-md">{children}</div>
    </TooltipWrapper>
  )
}
