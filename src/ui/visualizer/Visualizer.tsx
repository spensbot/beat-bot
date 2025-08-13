import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawVisualizer } from "./drawVisualizerCanvas2d"
import { store } from "@/redux/store"
import { PerfTime } from "@/utils/timeUtils"
import { useAppState } from "@/redux/hooks"
import { selectSessionEval } from "../stats/selectSessionEval"
import { emptySessionEval, SessionEval_t } from "@/engine/loop/SessionEval"

export default function Visualizer() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  const stats = useAppState(selectSessionEval) ?? emptySessionEval()

  useEffect(() => {
    let shouldDraw = true

    const drawCb = () => {
      if (!shouldDraw) return
      if (ref.current) {
        drawVisualizerWithCurrentState(ref.current, stats)
      }
      requestAnimationFrame(drawCb)
    }

    requestAnimationFrame(drawCb)

    return () => {
      shouldDraw = false
    }
  })

  return (
    <div className="h-30">
      <canvas
        ref={ref}
        className="w-full h-full"
        width={dims?.width}
        height={dims?.height}
      />
    </div>
  )
}

function drawVisualizerWithCurrentState(
  elem: HTMLCanvasElement,
  stats: SessionEval_t
) {
  const appState = store.getState().app
  const time = PerfTime.now()
  drawVisualizer(elem, appState, time, stats)
}
