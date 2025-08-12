import { Duration, PerfTime } from "@/utils/timeUtils"
import { AppState } from "@/engine/AppState"
import { getBeatMarkers, getVisualizerCtx, getVisualizerRatio, VisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import { drawLine, drawText, drawTriangles, Canvas2DRes as Res } from "./canvas2dUtils"
import { expandLoop } from "@/engine/loop/Loop"
import { SessionEval_t } from "@/engine/loop/SessionEval"

export function drawVisualizer(canvas: HTMLCanvasElement, appState: AppState, now: PerfTime, stats: SessionEval_t) {
  const ctx = canvas.getContext("2d")
  if (ctx === null) {
    console.error(`Failed to get context`)
    return
  }

  const res: Res = {
    canvas,
    ctx
  }

  const startTime = appState.activeSession?.start || now
  const vis = getVisualizerCtx(now, appState.visualizer)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBeatMarkers(res, vis, appState, now)
  drawLoop(res, vis, appState, now)
  drawPresses(res, vis, appState)

  const cursorRatio = getVisualizerRatio(now.duration.s(), vis)
  drawCursor(res, cursorRatio)

  console.log(`start: ${startTime} now: ${now} | vis ${vis.startTime_s} - ${vis.endTime_s} (${vis.length_s}) | ratio: ${cursorRatio}`)
}

function drawCursor(res: Res, ratio: number) {
  drawTriangles({
    color: '#fff',
    height: 8,
    width: 13,
    res,
    x: ratio
  })
  // drawLine(res, ratio, 1, 'white', 0.7)
}

function drawBeatMarkers(res: Res, vis: VisualizerCtx, appState: AppState, now: PerfTime) {
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
      res,
      x: xRatio
    })
    // drawLine(res, xRatio, 1, '#fff', 0.3)
  })
}

function drawPresses(res: Res, vis: VisualizerCtx, appState: AppState) {
  if (!appState.activeSession) return
  for (const press of appState.activeSession?.presses) {
    const ratio = getVisualizerRatio(press.time.duration.s(), vis)
    drawLine(res, ratio, 1, '#55f', 1)
  }
}

function drawLoop(res: Res, vis: VisualizerCtx, appState: AppState, now: PerfTime) {
  const { activeSession, loop, time: { tempo, loopRepeats } } = appState

  const start = activeSession?.start || now
  const playDuration = Duration.s(loop.beatLength * tempo.period.s() * loopRepeats)
  const end = start.plus(playDuration)
  const expandedLoop = expandLoop(loop, start, end, tempo)

  expandedLoop.forEach(note => {
    const ratio = getVisualizerRatio(note.time.duration.s(), vis)
    drawLine(res, ratio, 1, '#5f5', 0.5)
  })
}

function drawBeatNumbers(res: Res, vis: VisualizerCtx, appState: AppState, now: PerfTime) {
  getBeatMarkers(
    appState.activeSession?.start || now, // Use session start or default to 0
    vis,
    appState.time.tempo,
    4 // division depth
  ).map(marker => {
    const beatNumber = marker.divisor
    const x = getVisualizerRatio(marker.time_s, vis)
    const y = 10 // arbitrary y position
    res.ctx.fillText(beatNumber.toString(), x, y)
    drawText(res, beatNumber.toString(), x, 0.5, "fff") // Draw text at 5% of canvas height
  })
}