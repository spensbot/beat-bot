import { useAppState } from "@/redux/hooks"
import cn from "@/utils/cn"
import { selectSessionEval } from "./selectSessionEval"
import { getSessionStats } from "@/engine/loop/SessionStats"
import { HistoricalStatsView } from "./HistoricalStatsView"

export default function StatsView() {
  const eval_ = useAppState(selectSessionEval)
  const stats = eval_ ? getSessionStats(eval_) : null

  if (stats === null) return <div>No stats yet</div>

  const isLate = stats ? stats.delta_avg_s > 0 : false

  return (
    <div className="flex flex-col gap-2 w-50">
      {Stat("Score", [
        val(
          Math.floor(stats.score * 100).toFixed(0),
          2.5,
          getScoreColor(stats.score)
        ),
        // pun("%", 2),
      ])}
      {Stat("Deviation", [
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
      ])}
      {Stat(isLate ? "Late" : "Early", [
        pun(isLate ? "+" : "-", 1.2),
        val(
          Math.abs(stats.delta_avg_s * 1000).toFixed(1),
          1.5,
          getDeviationMsColor(Math.abs(stats.delta_avg_s * 1000))
        ),
        pun("ms", 1.2),
      ])}
      {Stat("Mistakes", [val(stats.nMistakes.toString(), 1.5, "white")])}
      {Stat("Velocity", [
        pun("±", 1.2),
        val((stats.velocity_stdDev * 100).toFixed(0), 1.5, "white"),
        pun("%", 1.2),
      ])}
      {/* <Stat name="Targets" value={nTargets} /> */}
      {/* <Stat name="Matches" value={matches} /> */}
      <HistoricalStatsView />
    </div>
  )
}

interface StatDisplay {
  text: string
  rem: number
  color: string
  weight: number
  width?: number
}

function val(text: string, rem: number, color: string): StatDisplay {
  return { text, rem, color, weight: 700 }
}

function pun(text: string, rem: number): StatDisplay {
  return { text, rem, color: "gray", weight: 400 }
}

function gap(rem: number): StatDisplay {
  return { text: "", rem, color: "transparent", weight: 0, width: rem }
}

const Stat = (name: string, displays: StatDisplay[]) => (
  <div>
    <div className="flex gap-0 items-center">
      {displays.map((d, i) => (
        <div
          key={i}
          style={{
            fontWeight: d.weight,
            color: d.color,
            fontSize: `${d.rem}rem`,
            lineHeight: 1,
            width: d.width ? `${d.width}rem` : "auto",
          }}
        >
          {d.text}
        </div>
      ))}
    </div>
    <p className="text-neutral-500">{name}</p>
  </div>
)

function getScoreColor(score: number) {
  if (score >= 0.9) return color(1)
  if (score >= 0.8) return color(0.7)
  if (score >= 0.7) return color(0.5)
  if (score >= 0.6) return color(0.3)
  return color(0)
}

function getDeviationMsColor(ms: number) {
  if (ms <= 10) return color(1)
  if (ms <= 15) return color(0.9)
  if (ms <= 20) return color(0.8)
  if (ms <= 25) return color(0.6)
  if (ms <= 30) return color(0.5)
  if (ms <= 40) return color(0.3)
  return color(0)
}

function getDevationRatioColor(ratio: number) {
  if (ratio <= 0.05) return color(1)
  if (ratio <= 0.1) return color(0.9)
  if (ratio <= 0.15) return color(0.8)
  if (ratio <= 0.2) return color(0.6)
  if (ratio <= 0.3) return color(0.5)
  if (ratio <= 0.4) return color(0.3)
  return color(0)
}

const color = (ratio: number) => `hsl(${ratio * 120}, 100%, 50%)`
