import { beatsToDuration, Duration, PerfTime } from "@/utils/timeUtils";
import { Press_t } from "../input/InputEngine";
import { Loop_t } from "./Loop";
import { TimeSettings } from "../AppState";

// const afterBuffer = Duration.s(0.5) // How long after the loop ends to consider presses valid

export interface Session_t {
  start: PerfTime // Where beat 0 begins
  end: PerfTime
  presses: Press_t[]
  scrubTime?: PerfTime
}

export function sessionStartTimeFromNow(now: PerfTime, time: TimeSettings): PerfTime {
  const countInTime = beatsToDuration(time.tempo, time.countInBeats)
  return now.plus(countInTime)
}

export function initSession(now: PerfTime, loop: Loop_t, time: TimeSettings): Session_t {
  const start = sessionStartTimeFromNow(now, time)
  const sessionDuration = getSessionDuration(loop, time)
  const end = start.plus(sessionDuration)
  // const end = start.plus(loopDuration.plus(afterBuffer))

  return {
    start,
    end,
    presses: []
  };
}

export function getSessionDuration(loop: Loop_t, time: TimeSettings): Duration {
  return beatsToDuration(time.tempo, loop.beatsPerBar * time.sessionBars / loop.data.beatLength)
}