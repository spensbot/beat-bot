import { lerp } from "@/utils/math"
import { store } from "@/redux/store"

interface Res {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export function drawVisualizer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (ctx === null) {
    console.error(`Failed to get context`)
    return
  }

  const res: Res = {
    canvas,
    ctx
  }

  const state = store.getState().metronome

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCursor(res, state.steady.playheadRatio)

  state.steady.layers
}

function drawCursor(res: Res, ratio: number) {
  drawLine(res, ratio, 2, 'white', 1)
}

function drawLine({ ctx, canvas }: Res, ratio: number, width: number, color: string, splitRatio: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  const x = canvas.width * ratio

  // drawLineSimple(ctx, x, 0, canvas.height)

  drawLineSimple(ctx, x, 0, lerp({ start: 0, end: canvas.height * 0.5 }, splitRatio))
  drawLineSimple(ctx, x, canvas.height, lerp({ start: canvas.height, end: canvas.height * 0.5 }, splitRatio))
}

function drawLineSimple(ctx: CanvasRenderingContext2D, x: number, y1: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2)
  ctx.stroke()
}

function drawGridMarkers() {

}

function drawGridMarker() {

}