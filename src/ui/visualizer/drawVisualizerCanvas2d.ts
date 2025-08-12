import { Duration, PerfTime } from "@/utils/timeUtils"
import { AppState } from "@/engine/AppState"
import { getBeatMarkers, getVisualizerCtx, getVisualizerRatio, VisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import { drawLine, drawRect, drawText, drawTriangles } from "./canvas2dUtils"
import { expandLoop } from "@/engine/loop/Loop"
import { SessionEval_t } from "@/engine/loop/SessionEval"

interface Ctx {
  canvas: CanvasRenderingContext2D,
  vis: VisualizerCtx,
  appState: AppState,
  now: PerfTime,
  stats: SessionEval_t
}

export function drawVisualizer(elem: HTMLCanvasElement, appState: AppState, now: PerfTime, stats: SessionEval_t) {
  const canvas = elem.getContext("2d")
  if (canvas === null) {
    console.error(`Failed to get context`)
    return
  }

  const ctx: Ctx = {
    canvas,
    vis: getVisualizerCtx(now, appState.visualizer),
    appState,
    now,
    stats
  }

  clear(ctx)
  drawMatches(ctx)
  drawBeatMarkers(ctx)
  drawLoop(ctx)
  drawPresses(ctx)

  drawCursor(ctx)
}

function clear({ canvas }: Ctx) {
  const { width, height } = canvas.canvas
  canvas.clearRect(0, 0, width, height)
}

function drawCursor({ now, vis, canvas }: Ctx) {
  const x = getVisualizerRatio(now.duration.s(), vis)

  drawTriangles({
    color: '#fff',
    height: 8,
    width: 13,
    ctx: canvas,
    x
  })
  // drawLine(res, ratio, 1, 'white', 0.7)
}

function drawBeatMarkers({ appState, now, vis, canvas }: Ctx) {
  getBeatMarkers(
    appState.activeSession?.start || now, // Use session start or default to 0
    vis,
    appState.time.tempo,
    4 // division depth
  ).map(marker => {
    const xRatio = getVisualizerRatio(marker.time_s, vis)
    drawTriangles({
      color: '#888',
      height: 8,
      width: 10,
      ctx: canvas,
      x: xRatio
    })
    // drawLine(res, xRatio, 1, '#fff', 0.3)
  })
}

function drawPresses({ canvas, vis, appState }: Ctx) {
  if (!appState.activeSession) return
  for (const press of appState.activeSession?.presses) {
    const ratio = getVisualizerRatio(press.time.duration.s(), vis)
    drawLine(canvas, ratio, 1, '#55f', 1)
  }
}

function drawLoop({ canvas, vis, appState, now }: Ctx) {
  const { activeSession, loop, time: { tempo, loopRepeats } } = appState

  const start = activeSession?.start || now
  const playDuration = Duration.s(loop.beatLength * tempo.period.s() * loopRepeats)
  const end = start.plus(playDuration)
  const expandedLoop = expandLoop(loop, start, end, tempo)

  expandedLoop.forEach(note => {
    const ratio = getVisualizerRatio(note.time.duration.s(), vis)
    drawLine(canvas, ratio, 1, '#5f5', 0.5)
  })
}

function drawBeatNumbers({ canvas, vis, appState, now }: Ctx) {
  getBeatMarkers(
    appState.activeSession?.start || now, // Use session start or default to 0
    vis,
    appState.time.tempo,
    4 // division depth
  ).map(marker => {
    const beatNumber = marker.divisor
    const x = getVisualizerRatio(marker.time_s, vis)
    const y = 10 // arbitrary y position
    canvas.fillText(beatNumber.toString(), x, y)
    drawText(canvas, beatNumber.toString(), x, 0.5, "fff") // Draw text at 5% of canvas height
  })
}

function drawMatches({ vis, canvas, stats }: Ctx) {
  stats.matches.forEach(match => {
    const x = getVisualizerRatio(match.note.time.duration.s(), vis)
    const width = match.delta_s / vis.length_s * canvas.canvas.width
    drawRect({
      ctx: canvas,
      x,
      width,
      color: '#f555'
    })
  })
}
