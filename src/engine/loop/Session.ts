import { beatsToDuration, PerfTime } from "@/utils/timeUtils";
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
  const loopDuration = beatsToDuration(time.tempo, loop.data.beatLength * time.loopRepeats);
  const end = start.plus(loopDuration)
  // const end = start.plus(loopDuration.plus(afterBuffer))

  return {
    start,
    end,
    presses: []
  };
}