import { describe, expect, test } from 'vitest'
import { ExpandedNote_t, expandLoop } from './expandLoop'
import { loopData } from './LoopData'
import { PerfTime, Tempo } from '@/utils/timeUtils'

describe('expandLoop', () => {
  test('should unroll a single note loop correctly', () => {
    const loop = loopData(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([note(1, 1)])
  })

  test('should unroll a loop with multiple notes correctly', () => {
    const loop = loopData(4, [1, 3])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([
      note(1, 1),
      note(3, 3)
    ])
  })

  test('should unroll a loop spanning multiple iterations correctly', () => {
    const loop = loopData(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(8)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([
      note(1, 1),
      note(5, 1)
    ])
  })

  test('should return an empty array when the loop has no notes', () => {
    const loop = loopData(4, [])
    const start = PerfTime.s(0)
    const end = PerfTime.s(4)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([])
  })

  test('should return an empty array when start and end times are the same', () => {
    const loop = loopData(4, [1])
    const start = PerfTime.s(0)
    const end = PerfTime.s(0)
    const result = expandLoop(loop, start, end, bpm60)
    expect(result).toEqual([])
  })
})

const bpm60: Tempo = { bpm: 60 }

function note(time_s: number, loopBeatTime: number): ExpandedNote_t {
  return {
    time: PerfTime.s(time_s),
    loopNote: { beatTime: loopBeatTime }
  }
}