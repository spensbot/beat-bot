import { LoopData_t } from "@/engine/loop/LoopData";
import { SessionEval_t } from "@/engine/session/SessionEval";
import { VisualizerCtx } from "@/engine/visualizer/visualizerUtils";
import { clear, drawCircle, drawLine, drawRect } from "@/ui/canvas2dUtils";
import { getPeriod_s } from "@/utils/timeUtils";

interface Ctx {
  vis: VisualizerCtx,
  canvas: CanvasRenderingContext2D,
  data: LoopData_t,
  buffer_beats: number,
  sessionEval?: SessionEval_t,
  bgColor?: string,
}

export function drawLoopVisualizer(elem: HTMLCanvasElement, vis: VisualizerCtx, data: LoopData_t, buffer_beats: number, sessionEval?: SessionEval_t, bgColor?: string) {
  const canvas = elem.getContext("2d")
  if (canvas === null) {
    console.error(`Failed to get context`)
    return
  }

  const ctx: Ctx = {
    vis,
    canvas,
    data,
    sessionEval,
    buffer_beats,
    bgColor
  }

  clear(canvas)

  drawBg(ctx)
  drawAvgHits(ctx)
  drawNotes(ctx)
  drawCursor(ctx)
}

function drawBg(ctx: Ctx) {
  if (!ctx.bgColor) return

  drawRect({
    ctx: ctx.canvas,
    x: getX(0, ctx),
    width: ctx.data.beatLength / beatLength(ctx) * ctx.canvas.canvas.width,
    color: ctx.bgColor
  })
}

function drawNotes(ctx: Ctx) {
  ctx.data.notes.forEach(note => {
    drawLine(ctx.canvas, getX(note.beatTime, ctx), 2, '#fff', 0.5)
  })
}

function drawAvgHits(ctx: Ctx) {
  const eval_ = ctx.sessionEval
  if (!eval_) return

  ctx.data.notes.forEach(note => {
    const stats = eval_.noteStats.get(note)
    if (!stats) return
    const s_per_beat = getPeriod_s(eval_.tempo)
    const delta_beats = stats.avg_delta_s / s_per_beat
    drawLine(ctx.canvas, getX(note.beatTime + delta_beats, ctx), 1, '#f55', 1)

    const std_dev_beats = stats.stdDev_delta_s / s_per_beat

    drawRect({
      ctx: ctx.canvas,
      x: getX(note.beatTime + delta_beats - std_dev_beats, ctx),
      width: std_dev_beats * 2 / beatLength(ctx) * ctx.canvas.canvas.width,
      color: '#f558'
    })

    // const max_delta_beats = stats.max_delta_s / s_per_beat
    // drawLine(ctx.canvas, getX(note.beatTime + max_delta_beats, ctx), 1, '#6f6', 1)

    // const min_delta_beats = stats.min_delta_s / s_per_beat
    // drawLine(ctx.canvas, getX(note.beatTime + min_delta_beats, ctx), 1, '#6f6', 1)

    drawCircle({
      ctx: ctx.canvas,
      x: getX(note.beatTime, ctx),
      y: 1 - stats.avg_velocity,
      radius: 4 * window.devicePixelRatio,
      color: '#55f'
    })
  })
}

function drawCursor(ctx: Ctx) {
  const loopBeatTime = ctx.vis.beatTime_loop

  console.log(loopBeatTime)

  drawLine(ctx.canvas, getX(loopBeatTime, ctx), 1, '#ff5', 1)
}

function drawBeatMarkersGradient(ctx: Ctx) {
  // TODO
}

function drawHits(ctx: Ctx) {
  // TODO
}

const beatLength = (ctx: Ctx) => ctx.data.beatLength + ctx.buffer_beats * 2

function getX(beatTime: number, ctx: Ctx) {
  const buff = ctx.buffer_beats
  const ratio = (beatTime + buff) / beatLength(ctx)
  return ratio
}