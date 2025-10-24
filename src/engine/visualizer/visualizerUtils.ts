import { PerfTime, getPeriod_s, Tempo } from "@/utils/timeUtils";
import { LoopNote_t } from "../loop/LoopData";
import { Session_t, sessionStartTimeFromNow } from "../session/Session";
import { AppState, TimeSettings } from "../AppState";

function getCursorTime(now: PerfTime, activeSession?: Session_t) {
  if (activeSession?.scrubTime !== undefined) return activeSession.scrubTime
  if (activeSession && activeSession.end.lessThan(now)) return activeSession.end
  return now
}

function getSessionStartTime(now: PerfTime, time: TimeSettings, activeSession?: Session_t) {
  let sessionStart = sessionStartTimeFromNow(now, time)
  if (activeSession) {
    sessionStart = activeSession.start
  }
  return sessionStart
}

/** The base required for drawing time points on a visualizer */
export interface VisualizerCtx {
  cursor_s: number
  startTime_s: number
  endTime_s: number
  length_s: number
  sessionStart_s: number
  countStart_s: number
  countEnd_s: number
  beatTime: number
  beatTime_loop: number
  beatTime_bar: number
}

export function getVisualizerCtx(now: PerfTime, { visualizer, time, activeSession, loop }: AppState): VisualizerCtx {
  const period_s = getPeriod_s(time.tempo)

  const cursorTime_s = getCursorTime(now, activeSession).duration.s()
  const sessionStartTime_s = getSessionStartTime(now, time, activeSession).duration.s()

  const startTime_s = cursorTime_s - visualizer.length_s * visualizer.playheadRatio;
  const endTime_s = startTime_s + visualizer.length_s;

  const countStart_s = sessionStartTime_s - time.countInBeats * period_s;
  const countEnd_s = activeSession?.end.duration.s() ?? Infinity

  const beatTime = (cursorTime_s - sessionStartTime_s) / period_s
  const beatTime_loop = beatTime % loop.data.beatLength
  const beatTime_bar = beatTime % loop.beatsPerBar

  return {
    cursor_s: cursorTime_s,
    startTime_s,
    endTime_s,
    length_s: visualizer.length_s,
    sessionStart_s: sessionStartTime_s,
    countStart_s,
    countEnd_s,
    beatTime,
    beatTime_loop,
    beatTime_bar
  }
}

export interface BeatMarker {
  time_s: number;
  count: number;
}

export function getBeatMarkers(
  vis: VisualizerCtx,
  tempo: Tempo,
  beatsPerBar: number
): BeatMarker[] {
  const markers: BeatMarker[] = []

  const period_s = getPeriod_s(tempo);

  let beatTime = Math.floor((vis.startTime_s - vis.sessionStart_s) / period_s) * period_s + vis.sessionStart_s;
  let count = (Math.floor((vis.startTime_s - vis.sessionStart_s) / period_s) + 1) % 4

  while (beatTime < vis.endTime_s) {
    if (beatTime > (vis.countStart_s - 0.01) && beatTime < (vis.countEnd_s - 0.01)) {
      markers.push({
        time_s: beatTime,
        count
      })
    }
    beatTime += period_s;
    count += 1
    if (count > beatsPerBar) count = 1
  }

  return markers
}

export function getVisualizerRatio(time_s: number, vis: VisualizerCtx): number {
  return (time_s - vis.startTime_s) / vis.length_s;
}

export interface LoopMarker {
  time_s: number;
  note: LoopNote_t // The divisor for the beat marker (e.g., 1, 2, 4, 8)
}