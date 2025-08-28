import { LoopId_t } from "@/engine/loop/Loop"
import Graph from "./Graph"
import { useAppState } from "@/redux/hooks"
import { PASSING_SCORE } from "@/engine/loop/SessionStats"
import { pun, Stat, val } from "../Stat"
import TooltipWrapper from "@/ui/tooltips/TooltipWrapper"

export function BpmGraph({ loopId }: { loopId: LoopId_t }) {
  const loopStats = useAppState((s) => s.sessionStatsByLoopId[loopId]) ?? []

  const passingStats = loopStats
    .filter((s) => s.score > PASSING_SCORE)
    .sort((a, b) => a.bpm - b.bpm)

  const points = passingStats.map((s, i) => {
    return { x: i, y: -s.bpm }
  })

  if (passingStats.length === 0) return null

  const best = passingStats[passingStats.length - 1]

  return (
    <TooltipWrapper tooltip="bpm-history">
      <div className="flex gap-1 items-start">
        <Graph data={{ points, lineWidth: 2, strokeStyle: "#0ff" }} />
        <div className="-mt-2">
          {Stat([val(best.bpm.toString(), 1, "white"), pun("BPM", 0.8)])}
        </div>
      </div>
    </TooltipWrapper>
  )
}
