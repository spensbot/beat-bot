import { Duration, PerfTime, Tempo } from "@/utils/timeUtils";
import { ExpandedNote_t, expandLoop } from "./expandLoop";
import { Session_t } from "./Session";
import { Press_t } from "../input/InputEngine";
import { Stats } from "@/utils/Stats";
import { LoopData_t } from "./LoopData";
import { last, sum } from "@/utils/listUtils";
import { clamp } from "@/utils/math";
import z from "zod";

/** The number of seconds that a press can register as a match outside the bounds of the session */
const OVERFLOW_S = 0.5

export interface Match_t {
  press: Press_t
  note: ExpandedNote_t
  delta_s: number
  delta_ratio: number
}

export interface SessionEval_t {
  targets: ExpandedNote_t[]
  matches: Match_t[]
  extraPresses: Set<Press_t>
  missedNotes: Set<ExpandedNote_t>
}

export function emptySessionEval(): SessionEval_t {
  return {
    targets: [],
    matches: [],
    extraPresses: new Set(),
    missedNotes: new Set(),
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
        delta_s,
        delta_ratio
      })
      unrolled.delete(note)
      presses.delete(closestPress)
    }
  })

  return {
    targets,
    matches,
    extraPresses: presses,
    missedNotes: unrolled,
  }
}

export const SessionStatsSchema = z.object({
  nTargets: z.number().int().min(0),
  nMatches: z.number().int().min(0),
  nMistakes: z.number().int().min(0),
  delta_avg_s: z.number().min(0),
  delta_stdDev_s: z.number().min(0),
  delta_avg_ratio: z.number().min(0).max(1),
  delta_stdDev_ratio: z.number().min(0).max(1),
  date: z.coerce.date(),
  score: z.number().min(0).max(1)
})

export type SessionStats_t = z.infer<typeof SessionStatsSchema>

export function getSessionStats({ targets, matches, extraPresses, missedNotes }: SessionEval_t): SessionStats_t {
  const nTargets = targets.length
  const nMistakes = extraPresses.size + missedNotes.size
  const score = clamp((sum(matches, m => 1 - Math.abs(m.delta_ratio)) - nMistakes) / targets.length, 0, 1)

  return {
    nTargets,
    nMatches: matches.length,
    nMistakes,
    delta_avg_s: Stats.mean(matches.map(m => m.delta_s)),
    delta_stdDev_s: Stats.stdDev(matches.map(m => m.delta_s)),
    delta_avg_ratio: Stats.mean(matches.map(m => m.delta_ratio)),
    delta_stdDev_ratio: Stats.stdDev(matches.map(m => m.delta_ratio)),
    date: new Date(),
    score
  }
}

export function emptySessionStats(): SessionStats_t {
  return {
    nTargets: 0,
    nMatches: 0,
    nMistakes: 0,
    delta_avg_s: 0,
    delta_stdDev_s: 0,
    delta_avg_ratio: 0,
    delta_stdDev_ratio: 0,
    date: new Date(),
    score: 1
  }
}