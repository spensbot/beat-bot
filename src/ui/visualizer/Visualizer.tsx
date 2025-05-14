import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawVisualizer } from "./VisualizerCanvas2d"
import { useAnimated, useSteady } from "@/redux/hooks"
import { useAnimatedValue } from "@/utils/hooks/useAnimationFrame"

export default function Visualizer() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)
  const val = useAnimatedValue(() => Math.random())

  useEffect(() => {
    if (ref.current !== null) {
      drawVisualizer(ref.current)
    }

    return () => {
      // cleanup
    }
  }, undefined) // always re-render for hot-reload

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
    </div>
  )
}
