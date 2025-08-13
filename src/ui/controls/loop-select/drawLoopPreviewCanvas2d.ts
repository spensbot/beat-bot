import { LoopData_t } from "@/engine/loop/LoopData";
import { clear, drawLine } from "@/ui/canvas2dUtils";

interface Ctx {
  canvas: CanvasRenderingContext2D,
  data: LoopData_t
}

export function drawLoopPreview(elem: HTMLCanvasElement, data: LoopData_t) {
  const canvas = elem.getContext("2d")
  if (canvas === null) {
    console.error(`Failed to get context`)
    return
  }

  const ctx: Ctx = {
    canvas,
    data
  }

  clear(canvas)

  drawNotes(ctx)
}

function drawNotes(ctx: Ctx) {
  const length = ctx.data.beatLength

  ctx.data.notes.forEach(note => {
    const ratio = note.beatTime / length
    drawLine(ctx.canvas, ratio, 1, '#fff', 1)
  })
}