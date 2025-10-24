import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { LoopData_t } from "@/engine/loop/LoopData"
import { drawLoopVisualizer } from "../../visualizer/drawLoopVisualizerCanvas2d"
import { store } from "@/redux/store"
import { getVisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import { PerfTime } from "@/utils/timeUtils"

export default function LoopPreview({ data }: { data: LoopData_t }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  useEffect(() => {
    const drawCb = () => {
      if (ref.current) {
        const appState = store.getState().app
        const vis = getVisualizerCtx(PerfTime.now(), appState)

        drawLoopVisualizer(ref.current, vis, data, 0)
      }
    }

    drawCb()
  })

  return (
    <div className="h-10 w-50 bg-emerald-900">
      <canvas
        ref={ref}
        className="w-full h-full"
        width={dims?.widthDevice}
        height={dims?.heightDevice}
      />
    </div>
  )
}
