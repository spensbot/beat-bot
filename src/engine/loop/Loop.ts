import { indexArray } from "@/utils/listUtils"
import { PerfTime, Tempo } from "@/utils/timeUtils"

export interface LoopNote_t {
  // Could add note, duration, velocity, etc in future
  beatTime: number // beats. Should be less than loop length.
}

// Represents a loop of hits
export interface Loop_t {
  name: string
  beatLength: number // beats
  notes: LoopNote_t[] // beats. start inclusive, end exclusive.
}

export function loop(length: number, beatTimes: number[], name: string = ''): Loop_t {
  return {
    name,
    beatLength: length,
    notes: beatTimes.map(beatTime => ({ beatTime }))
  }
}

export function repeat(hitCount: number, name: string = ''): Loop_t {
  return loop(1, indexArray(hitCount).map(i => i / hitCount), name)
}

export function concat(loops: Loop_t[], name: string = ''): Loop_t {
  return loops.reduce((acc, loop) => {
    const offset = acc.beatLength
    const shiftedHits = loop.notes.map(hit => ({
      beatTime: offset + hit.beatTime
    }))
    return {
      name,
      beatLength: offset + loop.beatLength,
      notes: acc.notes.concat(shiftedHits)
    }
  }, {
    name,
    beatLength: 0,
    notes: []
  })
}

export const defaultLoops: Loop_t[] = [
  repeat(1, 'Single'),
  repeat(2, 'Double'),
  repeat(3, 'Triple'),
  repeat(4, 'Quad'),
]

export interface ExpandedNote_t {
  time: PerfTime // Absolute time in the session
  loopNote: LoopNote_t // The note that was hit
}

export function expandLoop(loop: Loop_t, start: PerfTime, end: PerfTime, tempo: Tempo): ExpandedNote_t[] {
  const unrolled: ExpandedNote_t[] = []

  // Everything in seconds for easy math
  const start_s = start.duration.s()
  const end_s = end.duration.s()
  const beat_s = tempo.period.s() // Seconds per beat
  const loop_s = loop.beatLength * beat_s

  const loopCount = Math.ceil((end_s - start_s) / loop_s)

  for (let i = 0; i < loopCount; i++) {
    const offset_s = i * loop_s
    loop.notes.forEach(note => {
      const beatTime = start_s + offset_s + note.beatTime * beat_s
      unrolled.push({
        time: PerfTime.s(beatTime),
        loopNote: note
      })
    })
  }

  return unrolled
}
