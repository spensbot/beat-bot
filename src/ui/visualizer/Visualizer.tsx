import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawVisualizer } from "./drawVisualizerCanvas2d"
import { store } from "@/redux/store"
import { PerfTime } from "@/utils/timeUtils"
import { useAnimatedValue } from "@/utils/hooks/useAnimationFrame"

export default function Visualizer() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  useEffect(() => {
    let shouldDraw = true

    const drawCb = () => {
      if (!shouldDraw) return
      if (ref.current) {
        drawVisualizerWithCurrentState(ref.current)
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
        // width={dims?.widthDevice}
        // height={dims?.heightDevice}
        width={dims?.width}
        height={dims?.height}
      />
      <PerfTimeView />
    </div>
  )
}

function PerfTimeView() {
  const time = useAnimatedValue(() => PerfTime.now())
  return (
    <p className="text-s text-gray-500 text-left">{`Perf Time: ${time}`}</p>
  )
}

function drawVisualizerWithCurrentState(elem: HTMLCanvasElement) {
  const appState = store.getState().app
  const time = PerfTime.now()
  drawVisualizer(elem, appState, time)
}
