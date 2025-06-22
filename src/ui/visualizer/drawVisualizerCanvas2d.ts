import { lerp } from "@/utils/math"
import { PerfTime } from "@/utils/timeUtils"
import { AppState } from "@/engine/AppState"

interface Res {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export function drawVisualizer(canvas: HTMLCanvasElement, appState: AppState, time: PerfTime) {
  const ctx = canvas.getContext("2d")
  if (ctx === null) {
    console.error(`Failed to get context`)
    return
  }

  const res: Res = {
    canvas,
    ctx
  }

  appState.visualizer.playheadRatio

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCursor(res, appState.visualizer.playheadRatio)
}

function drawCursor(res: Res, ratio: number) {
  drawLine(res, ratio, 1, 'white', 0.5)
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