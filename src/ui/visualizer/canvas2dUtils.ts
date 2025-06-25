import { lerp } from "@/utils/math"

export interface Canvas2DRes {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export function drawLine({ ctx, canvas }: Canvas2DRes, ratio: number, width: number, color: string, splitRatio: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  const x = canvas.width * ratio

  // drawLineSimple(ctx, x, 0, canvas.height)

  drawLineSimple(ctx, x, 0, lerp({ start: 0, end: canvas.height * 0.5 }, splitRatio))
  drawLineSimple(ctx, x, canvas.height, lerp({ start: canvas.height, end: canvas.height * 0.5 }, splitRatio))
}

export function drawLineSimple(ctx: CanvasRenderingContext2D, x: number, y1: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2)
  ctx.stroke()
}
