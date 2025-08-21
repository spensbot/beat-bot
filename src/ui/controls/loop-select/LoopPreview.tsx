import { useDimsForRef } from "@/utils/hooks/useDims"
import { useEffect, useRef } from "react"
import { LoopData_t } from "@/engine/loop/LoopData"
import { drawLoopPreview } from "./drawLoopPreviewCanvas2d"

export default function LoopPreview({ data }: { data: LoopData_t }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const dims = useDimsForRef(ref)

  useEffect(() => {
    const drawCb = () => {
      if (ref.current) {
        drawLoopPreview(ref.current, data)
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
