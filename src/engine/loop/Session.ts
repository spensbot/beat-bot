import { Duration, PerfTime } from "@/utils/timeUtils";
import { Press_t } from "../input/InputEngine";
import { emptySessionEval, SessionEval_t } from "./SessionEval";
import { Loop_t } from "./Loop";
import { AppState, TimeSettings } from "../AppState";

// const afterBuffer = Duration.s(0.5) // How long after the loop ends to consider presses valid

export interface Session_t {
  start: PerfTime // Where beat 0 begins
  end: PerfTime
  presses: Press_t[]
  eval: SessionEval_t
}

export function sessionStartTime(now: PerfTime, time: TimeSettings): PerfTime {
  const countInTime = time.tempo.beatsToDuration(time.countInBeats)
  return now.plus(countInTime)
}

export function initSession(now: PerfTime, loop: Loop_t, time: TimeSettings): Session_t {
  const start = sessionStartTime(now, time)
  const loopDuration = time.tempo.beatsToDuration(loop.data.beatLength * time.loopRepeats);
  const end = start.plus(loopDuration)
  // const end = start.plus(loopDuration.plus(afterBuffer))

  return {
    start,
    end,
    presses: [],
    eval: emptySessionEval(),
  };
}