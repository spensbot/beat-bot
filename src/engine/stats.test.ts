import { expect, test } from 'vitest'
import { PerfTime } from '../utils/timeUtils'
import { HitStats, getHitStats, getSessionStats } from './stats'

const pt = (s: number) => PerfTime.s(s)

test('getHitStats', () => {
  expect(getHitStats(pt(1), pt(1)).delta.s()).toBe(0)
  expect(getHitStats(pt(3), pt(2)).delta.s()).toBe(1)
  expect(getHitStats(pt(1), pt(2)).delta.s()).toBe(-1)
})

test('getSessionStats', () => {
  const hitStats: HitStats[] = [
    getHitStats(pt(0), pt(1)),
    getHitStats(pt(2), pt(1))
  ]

  const sessionStats = getSessionStats(hitStats)

  expect(sessionStats.hitCount).toBe(2)
  expect(sessionStats.avgDelta.s()).toBe(0)
  expect(sessionStats.absAvgDelta.s()).toBe(1)
})

