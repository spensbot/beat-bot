import { PerfTime, Tempo } from "@/utils/timeUtils";
import { Loop_t, ExpandedNote_t, expandLoop } from "./Loop";
import { Session_t } from "./Session";
import { Press_t } from "../input/InputEngine";
import { Stats } from "@/utils/Stats";

export interface Match_t {
  press: Press_t
  note: ExpandedNote_t

  /** press_time - target_time
   * Indicates if the user's timing is early or late.
   * Negative = early, positive = late
  */
  drift: number
  /** abs(press_time - target_time)
   * Indicates how far the user's timing is from the target
   * Always positive
  */
  diff: number
}

export interface SessionEval_t {
  matches: Match_t[]
  extraPresses: Set<Press_t>
  missedNotes: Set<ExpandedNote_t>

  diff_avg_s: number
  drift_avg_s: number
  drift_stdDev_s: number
}

export function emptySessionEval(): SessionEval_t {
  return {
    matches: [],
    extraPresses: new Set(),
    missedNotes: new Set(),
    drift_avg_s: 0,
    diff_avg_s: 0,
    drift_stdDev_s: 0,
  }
}

export function evaluateSession(
  session: Session_t,
  loop: Loop_t,
  tempo: Tempo): SessionEval_t {
  const unrolledList = expandLoop(loop, session.start, session.end, tempo)
  const unrolled = new Set(unrolledList)
  const presses = new Set(session.presses)

  const matches: Match_t[] = []

  unrolledList.forEach((note, i) => {
    let minTime: PerfTime = session.start
    if (i > 0) {
      const prevNote = unrolledList[i - 1]
      minTime = prevNote.time.lerp(note.time, 0.5)
    }

    let maxTime: PerfTime = session.end
    if (i < unrolledList.length - 1) {
      const nextNote = unrolledList[i + 1]
      maxTime = note.time.lerp(nextNote.time, 0.5)
    }

    const closestPress = session.presses
      .filter(press => press.time.isBetween(minTime, maxTime))
      .sort((a, b) => {
        const aDelta = Math.abs(a.time.duration.s() - note.time.duration.s())
        const bDelta = Math.abs(b.time.duration.s() - note.time.duration.s())
        return aDelta - bDelta
      })
      .shift()

    if (closestPress) {
      matches.push({
        press: closestPress,
        note,
        drift: closestPress.time.duration.s() - note.time.duration.s(),
        diff: Math.abs(closestPress.time.duration.s() - note.time.duration.s())
      })
      unrolled.delete(note)
      presses.delete(closestPress)
    }
  })

  return {
    matches,

    extraPresses: presses,
    missedNotes: unrolled,

    diff_avg_s: Stats.mean(matches.map(m => getDiff_s(m.press, m.note))),
    drift_avg_s: Stats.mean(matches.map(m => getDrift_s(m.press, m.note))),
    drift_stdDev_s: Stats.stdDev(matches.map(m => getDrift_s(m.press, m.note)))
  }
}

const getDrift_s = (press: Press_t, note: ExpandedNote_t): number => press.time.duration.s() - note.time.duration.s()
const getDiff_s = (press: Press_t, note: ExpandedNote_t): number => Math.abs(press.time.duration.s() - note.time.duration.s())