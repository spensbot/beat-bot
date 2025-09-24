import { Duration, PerfTime, Tempo } from "@/utils/timeUtils";
import { ExpandedNote_t, expandLoop } from "../loop/expandLoop";
import { Session_t } from "./Session";
import { Press_t } from "../input/InputEngine";
import { LoopData_t, LoopNote_t } from "../loop/LoopData";
import { last } from "@/utils/listUtils";
import { Stats } from "@/utils/Stats";

/** The number of seconds that a press can register as a match outside the bounds of the session */
const OVERFLOW_S = 0.5

export interface Match_t {
  press: Press_t
  note: ExpandedNote_t
  velocity: number // Optional velocity for the match
  delta_s: number
  delta_ratio: number
}

export interface NoteStats_t {
  avg_delta_s: number
  stdDev_delta_s: number
  min_delta_s: number
  max_delta_s: number
  avg_velocity: number
}

export interface SessionEval_t {
  targets: ExpandedNote_t[]
  matches: Match_t[]
  extraPresses: Set<Press_t>
  missedNotes: Set<ExpandedNote_t>
  noteStats: Map<LoopNote_t, NoteStats_t>
  tempo: Tempo
}

export function emptySessionEval(): SessionEval_t {
  return {
    targets: [],
    matches: [],
    extraPresses: new Set(),
    missedNotes: new Set(),
    noteStats: new Map(),
    tempo: { bpm: 120 } // Default tempo
  }
}

export function evaluateSession(
  session: Session_t,
  loopData: LoopData_t,
  tempo: Tempo): SessionEval_t {
  const lastPressTime = last(session.presses)?.time ?? session.start
  const unrollEnd = lastPressTime.plus(Duration.s(OVERFLOW_S)).clamp(null, session.end)
  const targets = expandLoop(loopData, session.start, unrollEnd, tempo)
  const unrolled = new Set(targets)
  const presses = new Set(session.presses)

  const matches: Match_t[] = []

  targets.forEach((note, i) => {
    let minTime: PerfTime = session.start.plus(Duration.s(-OVERFLOW_S))
    if (i > 0) {
      const prevNote = targets[i - 1]
      minTime = prevNote.time.lerp(note.time, 0.5)
    }

    let maxTime: PerfTime = unrollEnd
    if (i < targets.length - 1) {
      const nextNote = targets[i + 1]
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
      const window_s = maxTime.duration.s() - minTime.duration.s()
      const delta_s = closestPress.time.duration.s() - note.time.duration.s()
      const delta_ratio = delta_s / window_s

      matches.push({
        press: closestPress,
        note,
        velocity: closestPress.velocity,
        delta_s,
        delta_ratio
      })
      unrolled.delete(note)
      presses.delete(closestPress)
    }
  })

  const noteStats = new Map<LoopNote_t, NoteStats_t>()
  for (const note of loopData.notes) {
    const noteMatches = matches.filter(m => m.note.loopNote === note)

    if (noteMatches.length > 0) {
      noteStats.set(note, {
        avg_velocity: Stats.mean(noteMatches.map(m => m.velocity)),
        avg_delta_s: Stats.mean(noteMatches.map(m => m.delta_s)),
        min_delta_s: Stats.min(noteMatches.map(m => m.delta_s)),
        max_delta_s: Stats.max(noteMatches.map(m => m.delta_s)),
        stdDev_delta_s: Stats.stdDev(noteMatches.map(m => m.delta_s))
      })
    }
  }

  return {
    targets,
    matches,
    extraPresses: presses,
    missedNotes: unrolled,
    noteStats,
    tempo
  }
}
