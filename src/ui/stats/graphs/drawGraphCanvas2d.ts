import { clear } from "@/ui/canvas2dUtils";
import { lerp, Range, unlerp } from "@/utils/math";
import { Stats } from "@/utils/Stats";

interface GraphPoint {
  x: number
  y: number
}

export interface GraphData {
  points: GraphPoint[]
  strokeStyle?: string
  lineWidth?: number
}

interface Ctx {
  canvas: CanvasRenderingContext2D,
  data: GraphData
}

export function drawGraph(elem: HTMLCanvasElement, data: GraphData) {
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

  drawPoints(ctx)
}

function drawPoints(ctx: Ctx) {
  const points = ctx.data.points

  const xRange: Range = {
    start: Stats.min(points.map(p => p.x)),
    end: Stats.max(points.map(p => p.x))
  }

  const yRange: Range = {
    start: Stats.min(points.map(p => p.y)),
    end: Stats.max(points.map(p => p.y))
  }

  ctx.canvas.strokeStyle = ctx.data.strokeStyle ?? "white"
  ctx.canvas.lineWidth = ctx.data.lineWidth ?? 1
  ctx.canvas.beginPath()
  const p0 = toCanvas(points[0], xRange, yRange, ctx)
  ctx.canvas.moveTo(p0.x, p0.y)

  for (let i = 1; i < points.length; i++) {
    const p = toCanvas(points[i], xRange, yRange, ctx)
    ctx.canvas.lineTo(p.x, p.y)
  }
  ctx.canvas.stroke()
}

function toCanvas(point: GraphPoint, xRange: Range, yRange: Range, ctx: Ctx): GraphPoint {
  return {
    x: unlerp(xRange, point.x) * ctx.canvas.canvas.width,
    y: unlerp(yRange, point.y) * ctx.canvas.canvas.height,
  }
}