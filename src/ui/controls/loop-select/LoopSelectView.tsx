import { Button } from "@/components/ui/button"
import { defaultLoops } from "@/engine/loop/defaultLoops"
import { Loop_t } from "@/engine/loop/Loop"
import LoopPreview from "./LoopPreview"
import { useDispatch } from "react-redux"
import { setLoop } from "@/redux/appSlice"
import useHover from "@/utils/hooks/useHover"
import { useAppState } from "@/redux/hooks"
import { cn } from "@/lib/utils"
import { LoopStatsView } from "@/ui/stats/LoopStatsView"
import { BpmGraph } from "@/ui/stats/graphs/BpmGraph"
import TooltipWrapper from "@/ui/tooltips/TooltipWrapper"

export function LoopSelectView({ className }: { className: string }) {
  return (
    <TooltipWrapper className={className} tooltip="exercise-select">
      {defaultLoops.map((loop) => (
        <LoopView key={loop.id} loop={loop} />
      ))}
    </TooltipWrapper>
  )
}

function LoopView({ loop }: { loop: Loop_t }) {
  const dispatch = useDispatch()

  const setAsActiveLoop = () => dispatch(setLoop(loop))

  const { hoverDiv, isHover } = useHover()

  const activeLoop = useAppState((s) => s.loop)
  const isActive = loop.id === activeLoop.id

  const isPoppin = isActive || isHover

  return (
    <div
      ref={hoverDiv}
      className={cn(
        "flex items-center gap-2 px-4 w-full h-15 opacity-70 cursor-pointer border border-transparent",
        isActive && "border-emerald-500",
        isPoppin && "bg-emerald-950 opacity-100"
      )}
      onClick={setAsActiveLoop}
    >
      <div className="flex flex-col gap-1 w-50">
        <p>{loop.name}</p>
        <Difficulty val={loop.difficulty} />
      </div>

      {/* <BeatsPerBar val={loop.beatsPerBar} /> */}
      <LoopPreview data={loop.data} />
      {isPoppin && (
        <>
          {/* <div>
            <Bars val={loop.data.beatLength / loop.beatsPerBar} />
            <BeatsPerBar val={loop.beatsPerBar} />
          </div> */}
          {/* <LoopStatsView loopId={loop.id} /> */}
        </>
      )}
      <BpmGraph loopId={loop.id} />
    </div>
  )
}

function Difficulty({ val }: { val: number }) {
  const width = 70

  return (
    <div className="h-2 bg-emerald-900" style={{ width }}>
      <div className="h-full bg-emerald-400" style={{ width: val * width }} />
    </div>
  )
}

function Bars({ val }: { val: number }) {
  return (
    <div>
      <span>{val} </span>
      <span className="text-neutral-500 text-sm">bars</span>
    </div>
  )
}

function BeatsPerBar({ val }: { val: number }) {
  return (
    <div>
      <span>{val} </span>
      <span className="text-neutral-500 text-sm">beats per bar</span>
    </div>
  )
}
