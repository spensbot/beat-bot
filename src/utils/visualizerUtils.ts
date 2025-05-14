import { MetronomeState } from "../redux/MetronomeState"
import { indexArray } from "./listUtils"
import { Range, rangeFromPointLength } from "./math"
import { Duration, PerfTime } from "./timeUtils"

export function visualizerRange(state: MetronomeState): Range {
  const now = state.animated.time.duration.s()
  return rangeFromPointLength(now, state.steady.visualizerLength, state.steady.playheadRatio)
}

export function isTimeInVisualizer(state: MetronomeState, time: PerfTime) {
  // All calculations in seconds
  const range = visualizerRange(state)
  const pressTime = time.duration.s()
  return pressTime > range.start && pressTime < range.end
}

export function getBeatTimesInWindow(state: MetronomeState): PerfTime[] {
  const range = visualizerRange(state)
  const nextBeat = state.steady.scheduledBeat.duration.s()

  const period = state.steady.tempo.period().s()
  // For now, assume the tempo has been consistent, rather than trying to track the actual time of past beats
  const pastBeatCount = Math.floor((nextBeat - range.start) / period)
  const futureBeatCount = Math.floor((range.end - nextBeat) / period)

  const pastBeats = indexArray(pastBeatCount).map(i => nextBeat - (i + 1) * period).reverse()
  const futureBeats = indexArray(futureBeatCount).map(i => nextBeat + i * period)

  return pastBeats.concat(futureBeats).map(s => new PerfTime(Duration.s(s)))
}

// Private