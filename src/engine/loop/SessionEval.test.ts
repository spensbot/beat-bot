import { PerfTime, Tempo } from '@/utils/timeUtils'
import { describe, expect, test } from 'vitest'
import { emptySessionEval, evaluateSession } from './SessionEval'
import { Press_t } from '../input/InputEngine'
import { Loop_t } from './Loop'
import { Session_t } from './Session'

describe('evaluateSession', () => {
  test('should correctly match presses to notes and calculate stats', () => {
    const loop = makeLoop(4, [1, 3])
    const session = makeSession(0, 4, [1.1, 3.2])
    const tempo = Tempo.bpm(60)
    const result = evaluateSession(session, loop, tempo)

    expect(result.matches.size).toBe(2)
    expect(result.extraPresses.size).toBe(0)
    expect(result.missedNotes.size).toBe(0)
    expect(result.averageDrift_s).toBeCloseTo(0.15)
    expect(result.averageDiff_s).toBeCloseTo(0.15)
  })

  test('should handle extra presses correctly', () => {
    const loop = makeLoop(4, [1])
    const session = makeSession(0, 4, [1.1, 2.5])
    const tempo = Tempo.bpm(60)
    const result = evaluateSession(session, loop, tempo)

    expect(result.matches.size).toBe(1)
    expect(result.extraPresses.size).toBe(1)
    expect(result.missedNotes.size).toBe(0)
    expect(result.averageDrift_s).toBeCloseTo(0.1)
    expect(result.averageDiff_s).toBeCloseTo(0.1)
  })

  test('should handle missed notes correctly', () => {
    const loop = makeLoop(4, [1, 3])
    const session = makeSession(0, 4, [1.1])
    const tempo = Tempo.bpm(60)
    const result = evaluateSession(session, loop, tempo)

    expect(result.matches.size).toBe(1)
    expect(result.extraPresses.size).toBe(0)
    expect(result.missedNotes.size).toBe(1)
    expect(result.averageDrift_s).toBeCloseTo(0.1)
    expect(result.averageDiff_s).toBeCloseTo(0.1)
  })

  test('should return empty stats when no presses or notes exist', () => {
    const loop = makeLoop(4, [])
    const session = makeSession(0, 4, [])
    const tempo = Tempo.bpm(60)
    const result = evaluateSession(session, loop, tempo)

    expect(result.matches.size).toBe(0)
    expect(result.extraPresses.size).toBe(0)
    expect(result.missedNotes.size).toBe(0)
    expect(result.averageDrift_s).toBeNaN()
    expect(result.averageDiff_s).toBeNaN()
  })
})

function press(s: number): Press_t {
  return {
    t: 'Press',
    time: PerfTime.s(s),
    velocity: 1,
    input: { type: 'KeyInput', key: 'a' }
  }
}

function makeLoop(beatLength: number, beatTimes: number[]): Loop_t {
  return {
    name: "test",
    beatLength,
    notes: beatTimes.map(beatTime => ({ beatTime }))
  }
}

function makeSession(startTime: number, endTime: number, pressTimes: number[]): Session_t {
  return {
    start: PerfTime.s(startTime),
    end: PerfTime.s(endTime),
    presses: pressTimes.map(pt => press(pt)),
    eval: emptySessionEval()
  }
}