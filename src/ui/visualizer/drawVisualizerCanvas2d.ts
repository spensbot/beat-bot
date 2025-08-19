import { Duration, PerfTime, getPeriod_s } from "@/utils/timeUtils"
import { AppState } from "@/engine/AppState"
import { getBeatMarkers, getVisualizerCtx, getVisualizerRatio, VisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import { clear, drawLine, drawRect, drawText, drawTriangles } from "../canvas2dUtils"
import { expandLoop } from "@/engine/loop/expandLoop"
import { SessionEval_t } from "@/engine/loop/SessionEval"

interface Ctx {
  canvas: CanvasRenderingContext2D,
  vis: VisualizerCtx,
  appState: AppState,
  stats: SessionEval_t,
}

export function drawVisualizer(elem: HTMLCanvasElement, appState: AppState, now: PerfTime, stats: SessionEval_t) {
  const canvas = elem.getContext("2d")
  if (canvas === null) {
    console.error(`Failed to get context`)
    return
  }

  const ctx: Ctx = {
    canvas,
    vis: getVisualizerCtx(now, appState),
    appState,
    stats
  }

  clear(canvas)
  drawMatches(ctx)
  drawBeatMarkers(ctx)
  drawLoop(ctx)
  drawPresses(ctx)
  drawCount(ctx)

  drawCursor(ctx)
}

function drawCursor({ vis, canvas }: Ctx) {
  const x = getVisualizerRatio(vis.cursor_s, vis)

  drawTriangles({
    color: '#fff',
    height: 8,
    width: 13,
    ctx: canvas,
    x
  })
  drawLine(canvas, x, 1, '#fff5', 0.8)
}

function drawBeatMarkers({ appState, vis, canvas }: Ctx) {
  getBeatMarkers(
    vis,
    appState.time.tempo,
    4
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

function drawLoop({ canvas, vis, appState }: Ctx) {
  const { loop, time: { tempo, loopRepeats } } = appState

  const playDuration = Duration.s(loop.data.beatLength * getPeriod_s(tempo) * loopRepeats)
  const sessionStart = PerfTime.s(vis.sessionStart_s)
  const end = sessionStart.plus(playDuration)
  const expandedLoop = expandLoop(loop.data, sessionStart, end, tempo)

  expandedLoop.forEach(note => {
    const ratio = getVisualizerRatio(note.time.duration.s(), vis)
    drawLine(canvas, ratio, 1, '#5f5', 0.5)
  })
}

function drawCount({ canvas, vis, appState }: Ctx) {
  getBeatMarkers(
    vis,
    appState.time.tempo,
    4 // division depth
  ).map(marker => {
    const x = getVisualizerRatio(marker.time_s, vis)
    const y = 0.5
    drawText({
      ctx: canvas,
      text: marker.count.toString(),
      x,
      y,
      color: '#fff',
      size: 18
    })
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
