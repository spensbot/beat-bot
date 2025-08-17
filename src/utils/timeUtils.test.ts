import { expect, test } from 'vitest'
import { vi } from 'vitest'
import { Tempo, Duration, AudioTime, PerfTime } from './timeUtils'
import { getAudioContext } from '../engine/audio/audioUtils'

class AudioContextMock {
  currentTime = 1
  baseLatency = 0
  outputLatency = 0
}

vi.stubGlobal('window', {
  performance: {
    now: () => 1005
  },
  AudioContext: AudioContextMock
})

const ctx = getAudioContext()

test('Duration.s()', () => {
  expect(Duration.s(1000).s()).toBe(1000)
})

test('Duration.ms()', () => {
  expect(Duration.ms(1000).ms()).toBe(1000)
})

test('Tempo.bpm()', () => {
  expect(Tempo.bpm(120).bpm()).toBe(120)
})

test('Tempo.period()', () => {
  expect(Tempo.bpm(120).period.s()).toBe(0.5)
})

test('Tempo.beatsToDuration()', () => {
  expect(Tempo.bpm(120).beatsToDuration(2).s()).toBe(1)
})

test('Tempo.durationToBeats()', () => {
  expect(Tempo.bpm(120).durationToBeats(Duration.s(1))).toBe(2)
})

test('PerfTime.now()', () => {
  expect(PerfTime.now().duration.ms()).toBeCloseTo(window.performance.now())
})

test('PerfTime.lerp()', () => {
  const start = PerfTime.s(1)
  const end = PerfTime.s(3)
  const begin = start.lerp(end, 0)
  expect(begin.duration.s()).toBe(1)
  const mid = start.lerp(end, 0.5)
  expect(mid.duration.s()).toBe(2)
  const endLerp = start.lerp(end, 1)
  expect(endLerp.duration.s()).toBe(3)
})

test('PerfTime.isBetween()', () => {
  const start = PerfTime.s(1)
  const end = PerfTime.s(3)
  const mid = PerfTime.s(2)
  expect(mid.isBetween(start, end)).toBe(true)
  expect(start.isBetween(mid, end)).toBe(false)
  expect(end.isBetween(start, mid)).toBe(false)
})

test('AudioTime.now()', () => {
  expect(AudioTime.now(ctx).duration.s()).toBe(ctx.currentTime)
})

test('AudioTime.toPerf()', () => {
  expect(AudioTime.now(ctx).toPerf(ctx).duration.ms()).toBeCloseTo(window.performance.now())
})