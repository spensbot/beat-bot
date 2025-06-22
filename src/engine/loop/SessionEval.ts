import { PerfTime, Tempo } from "@/utils/timeUtils";
import { Loop_t, ExpandedNote_t, expandLoop } from "./Loop";
import { Session_t } from "./Session";
import { Press_t } from "../input/InputEngine";

export interface SessionEval_t {
  matches: Map<Press_t, ExpandedNote_t>
  extraPresses: Set<Press_t>
  missedNotes: Set<ExpandedNote_t>

  /** avg(press_time - target_time)
   * Indicates if the user's timing is early or late.
   * Negative = early, positive = late
  */
  averageDrift_s: number

  /** avg(abs(press_time - target_time))
   * Indicates how far the user's timing is from the target
   * Always positive
  */
  averageDiff_s: number
}

export function emptySessionEval(): SessionEval_t {
  return {
    matches: new Map(),
    extraPresses: new Set(),
    missedNotes: new Set(),
    averageDrift_s: 0,
    averageDiff_s: 0
  }
}

export function evaluateSession(
  session: Session_t,
  loop: Loop_t,
  tempo: Tempo): SessionEval_t {
  const unrolledList = expandLoop(loop, session.start, session.end, tempo)
  const unrolled = new Set(unrolledList)
  const presses = new Set(session.presses)

  const matches = new Map<Press_t, ExpandedNote_t>()

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
      matches.set(closestPress, note)
      unrolled.delete(note)
      presses.delete(closestPress)
    }
  })

  return {
    matches,

    extraPresses: presses,
    missedNotes: unrolled,

    averageDrift_s: calculateAverageDrift_s(matches),
    averageDiff_s: calculateAverageDiff_s(matches)
  }
}

function calculateAverageDrift_s(matches: Map<Press_t, ExpandedNote_t>): number {
  let totalDrift = 0

  matches.forEach((note, press) => {
    const drift = press.time.duration.s() - note.time.duration.s()
    totalDrift += drift
  })

  return totalDrift / matches.size
}

function calculateAverageDiff_s(matches: Map<Press_t, ExpandedNote_t>): number {
  let totalDiff = 0

  matches.forEach((note, press) => {
    const diff = Math.abs(press.time.duration.s() - note.time.duration.s())
    totalDiff += diff
  })

  return totalDiff / matches.size
}