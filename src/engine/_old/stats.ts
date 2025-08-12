import { Duration, PerfTime } from "../../utils/timeUtils";

export interface SessionStats {
  avgDelta: Duration // Indicates how far ahead or behind on average
  absAvgDelta: Duration // (Accuracy) Indicates how far off on average
  hitCount: number
}

export function getSessionStats(hitStats: HitStats[]): SessionStats {
  return {
    avgDelta: avgDuration(hitStats.map(s => s.delta)),
    absAvgDelta: absAvgDuration(hitStats.map(s => s.absDelta)),
    hitCount: hitStats.length
  }
}

export interface HitStats {
  delta: Duration
  absDelta: Duration
}

export function getHitStats(hitTime: PerfTime, targetTime: PerfTime): HitStats {
  const delta = hitTime.duration.minus(targetTime.duration)
  const absDelta = delta.abs()

  return {
    delta,
    absDelta
  }
}

// ============ Private =============

function avgDuration(durations: Duration[]): Duration {
  const s = durations.reduce((acc, d) => acc + d.s(), 0)
  return Duration.s(s / durations.length)
}

function absAvgDuration(durations: Duration[]): Duration {
  const absS = durations.reduce((acc, d) => acc + Math.abs(d.s()), 0)
  return Duration.s(absS / durations.length)
}