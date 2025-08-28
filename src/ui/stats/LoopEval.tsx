import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawLoopPreview } from "../controls/loop-select/drawLoopPreviewCanvas2d"
import { useAppState } from "@/redux/hooks"
import { selectSessionEval } from "@/ui/stats/selectSessionEval"
import { emptySessionEval } from "@/engine/loop/SessionEval"
import TooltipWrapper from "../tooltips/TooltipWrapper"

export default function LoopEval() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  const activeLoop = useAppState((state) => state.loop)

  const stats = useAppState(selectSessionEval) ?? emptySessionEval()

  useEffect(() => {
    const drawCb = () => {
      if (ref.current) {
        drawLoopPreview(
          ref.current,
          activeLoop.data,
          0.1,
          stats,
          "hsl(150, 50%, 20%)"
        )
      }
    }

    drawCb()
  })

  return (
    <TooltipWrapper tooltip="pattern">
      <div className="h-30 w-120">
        <canvas
          ref={ref}
          className="w-full h-full"
          width={dims?.widthDevice}
          height={dims?.heightDevice}
        />
      </div>
    </TooltipWrapper>
  )
}
