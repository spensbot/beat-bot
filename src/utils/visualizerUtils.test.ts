import { describe, expect, test } from 'vitest'
// import { AppState } from '../engine/AppState'
// import { Duration, PerfTime, Tempo } from './timeUtils'
// import { visualizerRange, isTimeInVisualizer, getBeatTimesInWindow } from './visualizerUtils'

test('temp', () => { })

// const state: AppState = {
//   tempo: Tempo.bpm(120),
//   scheduledBeat: new PerfTime(Duration.s(3)),
//   metronomeGain: 1,
//   visualizerLength: 4,
//   playheadRatio: 0.5,
//   layers: [],
//   bars: 16,
//   playState: 'Stopped',
//   sessionState: null,
//   timeSignature: {
//     beatsPerMeasure: 4
//   }
// }

// function pt(s: number): PerfTime {
//   return new PerfTime(Duration.s(s))
// }

// test('visualizerRange', () => {
//   const range = visualizerRange(state)

//   expect(range.start).toBe(0)
//   expect(range.end).toBe(4)
// })

// test('isTimeInVisualizer', () => {
//   expect(isTimeInVisualizer(state, pt(-0.1))).toBe(false)
//   expect(isTimeInVisualizer(state, pt(0.1))).toBe(true)
//   expect(isTimeInVisualizer(state, pt(2))).toBe(true)
//   expect(isTimeInVisualizer(state, pt(3.9))).toBe(true)
//   expect(isTimeInVisualizer(state, pt(4.1))).toBe(false)
// })

// test('getBeatsInTimeWindow', () => {
//   const beats = getBeatTimesInWindow(state).map(p => p.duration.s())

//   expect(beats[0]).toBe(0)
//   expect(beats[1]).toBe(0.5)
//   expect(beats[2]).toBe(1)
//   expect(beats[3]).toBe(1.5)
//   expect(beats[4]).toBe(2)
//   expect(beats[5]).toBe(2.5)
//   expect(beats[6]).toBe(3)
//   expect(beats[7]).toBe(3.5)
// })