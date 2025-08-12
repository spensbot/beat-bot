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

export function drawText(res: Canvas2DRes, text: string, xRatio: number, yRatio: number, color: string) {
  const x = getX(res, xRatio)
  const y = getY(res, yRatio)

  res.ctx.font = "48px serif";
  res.ctx.fillStyle = color
  res.ctx.fillText(text, x, y)
}

interface DrawTrianglesProps {
  res: Canvas2DRes
  x: number
  height: number
  width: number
  color: string
}

export function drawTriangles(p: DrawTrianglesProps) {
  drawTriangle({
    ...p,
    y: 0
  })
  drawTriangle({
    ...p,
    y: 1,
    height: -p.height
  })
}

interface DrawTriangleProps extends DrawTrianglesProps {
  y: number
}

export function drawTriangle(p: DrawTriangleProps) {
  drawTriangleSimple({
    ...p,
    x: getX(p.res, p.x),
    y: getY(p.res, p.y)
  })
}

/** x, y is for the bottom point of the triangle */
function drawTriangleSimple({ res: { ctx }, x, y, color, width, height }: DrawTriangleProps) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x + width / 2, y)
  ctx.lineTo(x - width / 2, y)
  ctx.closePath()
  ctx.fill()
}

const getX = (res: Canvas2DRes, xRatio: number) => res.canvas.width * xRatio
const getY = (res: Canvas2DRes, yRatio: number) => res.canvas.height * yRatio