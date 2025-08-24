import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { drawGraph, GraphData } from "./drawGraphCanvas2d"

export default function Graph({ data }: { data: GraphData }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  useEffect(() => {
    const drawCb = () => {
      if (ref.current) {
        drawGraph(ref.current, data)
      }
    }

    drawCb()
  })

  return (
    <div className="h-8 w-30 bg-emerald-900">
      <canvas
        ref={ref}
        className="w-full h-full"
        width={dims?.widthDevice}
        height={dims?.heightDevice}
      />
    </div>
  )
}
