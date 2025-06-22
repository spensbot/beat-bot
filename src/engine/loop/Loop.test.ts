import { describe, expect, test } from 'vitest'
import { concat, ExpandedNote_t, expandLoop, Loop_t, repeat } from './Loop'
import { PerfTime, Tempo } from '@/utils/timeUtils'

test('repeat()', () => {
  const one = repeat(1)
  expect(one.beatLength).toBe(1)
  expect(one.notes.length).toBe(1)
  expect(one.notes[0].beatTime).toBe(0.0)

  const two = repeat(2)
  expect(two.beatLength).toBe(1)
  expect(two.notes.length).toBe(2)
  expect(two.notes[0].beatTime).toBe(0.0)
  expect(two.notes[1].beatTime).toBe(0.5)
})

test('concat()', () => {
  const res = concat([repeat(1), repeat(2)])
  expect(res.beatLength).toBe(2)
  expect(res.notes.length).toBe(3)
  expect(res.notes[0].beatTime).toBe(0.0)
  expect(res.notes[1].beatTime).toBe(1.0)
  expect(res.notes[2].beatTime).toBe(1.5)
})

describe('expandLoop', () => {
  test('should unroll a single note loop correctly', () => {
    const loop = makeLoop(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const tempo = Tempo.bpm(60) // 60 BPM = 1 beat per second
    const result = expandLoop(loop, start, end, tempo)
    expect(result).toEqual([note(1, 1)])
  })

  test('should unroll a loop with multiple notes correctly', () => {
    const loop = makeLoop(4, [1, 3])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const tempo = Tempo.bpm(60) // 60 BPM = 1 beat per second
    const result = expandLoop(loop, start, end, tempo)
    expect(result).toEqual([
      note(1, 1),
      note(3, 3)
    ])
  })

  test('should unroll a loop spanning multiple iterations correctly', () => {
    const loop = makeLoop(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(8)
    const tempo = Tempo.bpm(60) // 60 BPM = 1 beat per second
    const result = expandLoop(loop, start, end, tempo)
    expect(result).toEqual([
      note(1, 1),
      note(5, 1)
    ])
  })

  test('should return an empty array when the loop has no notes', () => {
    const loop = makeLoop(4, [])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const tempo = Tempo.bpm(60) // 60 BPM = 1 beat per second
    const result = expandLoop(loop, start, end, tempo)
    expect(result).toEqual([])
  })

  test('should return an empty array when start and end times are the same', () => {
    const loop = makeLoop(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(0)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([])
  })
})

const bpm60 = Tempo.bpm(60)

function makeLoop(beatLength: number, beatTimes: number[]): Loop_t {
  return {
    name: "test",
    beatLength,
    notes: beatTimes.map(beatTime => ({ beatTime }))
  }
}

function note(time_s: number, loopBeatTime: number): ExpandedNote_t {
  return {
    time: PerfTime.s(time_s),
    loopNote: { beatTime: loopBeatTime }
  }
}