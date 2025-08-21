import z from "zod";

import { Stats } from "@/utils/Stats";
import { sum } from "@/utils/listUtils";
import { clamp } from "@/utils/math";
import { Match_t, SessionEval_t } from "./SessionEval";

export const SessionStatsSchema = z.object({
  nTargets: z.number().int(),
  nMatches: z.number().int(),
  nMistakes: z.number().int(),
  delta_avg_s: z.number(),
  delta_stdDev_s: z.number(),
  delta_avg_ratio: z.number(),
  delta_stdDev_ratio: z.number(),
  velocity_avg: z.number(),
  velocity_stdDev: z.number(),
  date: z.coerce.date(),
  score: z.number(),
  bpm: z.number()
})

export type SessionStats_t = z.infer<typeof SessionStatsSchema>

export function getSessionStats(eval_: SessionEval_t): SessionStats_t {
  const { targets, matches } = eval_;
  const nTargets = targets.length
  const nMistakes = calculateNMistakes(eval_)
  const score = calculateScore(eval_)

  return {
    nTargets,
    nMatches: matches.length,
    nMistakes,
    delta_avg_s: Stats.mean(matches.map(m => m.delta_s)),
    delta_stdDev_s: Stats.stdDev(matches.map(m => m.delta_s)),
    delta_avg_ratio: Stats.mean(matches.map(m => m.delta_ratio)),
    delta_stdDev_ratio: Stats.stdDev(matches.map(m => m.delta_ratio)),
    velocity_avg: Stats.mean(matches.map(m => m.velocity)),
    velocity_stdDev: Stats.stdDev(matches.map(m => m.velocity)),
    date: new Date(),
    score,
    bpm: eval_.tempo.bpm // Include the BPM in the session stats
  }
}

function calculateNMistakes({ extraPresses, missedNotes }: SessionEval_t): number {
  return extraPresses.size + missedNotes.size
}

function calculateScore({ targets, matches, extraPresses }: SessionEval_t): number {
  const matchScoreSum = sum(matches, getMatchScore);
  const nExtraPresses = extraPresses.size;
  const rawSessionScore = (matchScoreSum - nExtraPresses) / targets.length
  return clamp(rawSessionScore, 0, 1)
}

/** Returns a value from 0 to 1 representing how well the press matched the note */
function getMatchScore(match: Match_t): number {
  return 1 - Math.abs(match.delta_ratio)
}