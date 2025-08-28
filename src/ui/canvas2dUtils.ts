import { lerp } from "@/utils/math"

export function clear(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}

export function drawLine(ctx: CanvasRenderingContext2D, ratio: number, width: number, color: string, splitRatio: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  const x = ctx.canvas.width * ratio

  // drawLineSimple(ctx, x, 0, canvas.height)

  drawLineSimple(ctx, x, 0, lerp({ start: 0, end: ctx.canvas.height * 0.5 }, splitRatio))
  drawLineSimple(ctx, x, ctx.canvas.height, lerp({ start: ctx.canvas.height, end: ctx.canvas.height * 0.5 }, splitRatio))
}

export function drawLineSimple(ctx: CanvasRenderingContext2D, x: number, y1: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2)
  ctx.stroke()
}

interface DrawTextProps {
  ctx: CanvasRenderingContext2D
  text: string
  x: number
  y: number
  color: string
  size: number
}

export function drawText({ ctx, text, x, y, color, size }: DrawTextProps) {
  const xpx = getX(ctx, x) - size / 4
  const ypx = getY(ctx, y) + size / 4

  ctx.font = `${size}px sarif`;
  ctx.fillStyle = color
  ctx.fillText(text, xpx, ypx)
}

interface DrawTrianglesProps {
  ctx: CanvasRenderingContext2D
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
    x: getX(p.ctx, p.x),
    y: getY(p.ctx, p.y)
  })
}

/** x, y is for the bottom point of the triangle */
function drawTriangleSimple({ ctx, x, y, color, width, height }: DrawTriangleProps) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x + width / 2, y)
  ctx.lineTo(x - width / 2, y)
  ctx.closePath()
  ctx.fill()
}

interface DrawSquareProps {
  ctx: CanvasRenderingContext2D
  x: number
  width: number
  color: string
}

export function drawRect(p: DrawSquareProps) {
  drawRectSimple({
    ...p,
    x: getX(p.ctx, p.x)
  })
}

function drawRectSimple({ ctx, x, width, color }: DrawSquareProps) {
  ctx.fillStyle = color
  ctx.fillRect(x, 0, width, ctx.canvas.height)
}

interface DrawCircleProps {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  radius: number
  color: string
}

export function drawCircle({ ctx, x, y, ...rest }: DrawCircleProps) {
  drawCircleSimple({
    ctx,
    x: getX(ctx, x),
    y: getY(ctx, y),
    ...rest
  })
}

function drawCircleSimple({ ctx, x, y, radius, color }: DrawCircleProps) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

const getX = (ctx: CanvasRenderingContext2D, xRatio: number) => ctx.canvas.width * xRatio
const getY = (ctx: CanvasRenderingContext2D, yRatio: number) => ctx.canvas.height * yRatio