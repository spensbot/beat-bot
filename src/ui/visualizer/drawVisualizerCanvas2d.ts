import { PerfTime } from "@/utils/timeUtils"
import { AppState } from "@/engine/AppState"
import { getBeatMarkers, getVisualizerCtx, getVisualizerRatio, VisualizerCtx } from "@/engine/visualizer/visualizerUtils"
import { drawLine, Canvas2DRes as Res } from "./canvas2dUtils"

export function drawVisualizer(canvas: HTMLCanvasElement, appState: AppState, now: PerfTime) {
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
  drawPresses(res, vis, appState)

  const cursorRatio = getVisualizerRatio(now.duration.s(), vis)
  drawCursor(res, cursorRatio)

  console.log(`start: ${startTime} now: ${now} | vis ${vis.startTime_s} - ${vis.endTime_s} (${vis.length_s}) | ratio: ${cursorRatio}`)
}

function drawCursor(res: Res, ratio: number) {
  drawLine(res, ratio, 1, 'white', 0.5)
}

function drawBeatMarkers(res: Res, vis: VisualizerCtx, appState: AppState, now: PerfTime) {
  getBeatMarkers(
    appState.activeSession?.start || now, // Use session start or default to 0
    vis,
    appState.time.tempo,
    4 // division depth
  ).map(marker => {
    drawLine(res, getVisualizerRatio(marker.time_s, vis), 1, '#fff5', 0.3)
  })
}

function drawPresses(res: Res, vis: VisualizerCtx, appState: AppState) {
  if (!appState.activeSession) return
  for (const press of appState.activeSession?.presses) {
    const ratio = getVisualizerRatio(press.time.duration.s(), vis)
    drawLine(res, ratio, 1, '#59f', 1)
  }
}