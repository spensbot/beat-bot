import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawVisualizer } from "./drawVisualizerCanvas2d"
import { store } from "@/redux/store"
import { PerfTime } from "@/utils/timeUtils"
import { useAppState, useDispatch } from "@/redux/hooks"
import { selectSessionEval } from "../stats/selectSessionEval"
import { emptySessionEval, SessionEval_t } from "@/engine/loop/SessionEval"
import useDragMapped from "@/utils/hooks/useDragMapped"
import { setSessionScrubTime, setVisualizerLength } from "@/redux/appSlice"
import { getVisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import cn from "@/utils/cn"

export default function Visualizer() {
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(canvasRef)

  const canDrag = useAppState((s) => s.activeSession !== undefined)

  const stats = useAppState(selectSessionEval) ?? emptySessionEval()

  useEffect(() => {
    let shouldDraw = true

    const drawCb = () => {
      if (!shouldDraw) return
      if (canvasRef.current) {
        drawVisualizerWithCurrentState(canvasRef.current, stats)
      }
      requestAnimationFrame(drawCb)
    }

    requestAnimationFrame(drawCb)

    return () => {
      shouldDraw = false
    }
  })

  const [dragRef, onMouseDown] = useDragMapped(({ dx }) => {
    const appState = store.getState().app
    const vis = getVisualizerCtx(PerfTime.now(), appState)

    const delta_s = dx * vis.length_s

    dispatch(setSessionScrubTime(PerfTime.s(vis.cursor_s - delta_s)))
  })

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const visualizerLength = store.getState().app.visualizer.length_s

    dispatch(setVisualizerLength(visualizerLength - e.deltaY * 0.01))
  }

  return (
    <div
      ref={dragRef}
      onMouseDown={onMouseDown}
      onWheel={onWheel}
      className={cn("h-30", canDrag && "cursor-grab")}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={dims?.widthDevice}
        height={dims?.heightDevice}
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
