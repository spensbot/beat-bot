import { Duration, PerfTime } from "@/utils/timeUtils";
import { Press_t } from "../input/InputEngine";
import { emptySessionEval, SessionEval_t } from "./SessionEval";
import { Loop_t } from "./Loop";
import { TimeSettings } from "../AppState";

const afterBuffer = Duration.s(0.5) // How long after the loop ends to consider presses valid

export interface Session_t {
  start: PerfTime // Where beat 0 begins
  end: PerfTime
  presses: Press_t[]
  eval: SessionEval_t
}

export function initSession(now: PerfTime, loop: Loop_t, time: TimeSettings): Session_t {
  const countInTime = time.tempo.beatsToDuration(time.countInBeats)

  const start = now.plus(countInTime)
  const loopDuration = time.tempo.beatsToDuration(loop.data.beatLength * time.loopRepeats);
  const end = start.plus(loopDuration.plus(afterBuffer))

  return {
    start,
    end,
    presses: [],
    eval: emptySessionEval(),
  };
}