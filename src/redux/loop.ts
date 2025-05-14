import { indexArray } from "../utils/listUtils"

export interface TimeSignature {
  beatsPerMeasure: number
  // I think the lower number in a time signature is dumb...
  // But my knowledge of music theory is limited so maybe there's a good reason for it that I don't understand
}

export interface LoopNote {
  // Could add note, duration, velocity, etc in future
  time: number // beats
}

// Represents a loop of hits
export interface Loop {
  name: string
  length: number // beats
  hits: LoopNote[] // beats. start inclusive, end exclusive.
}

export function loop(length: number, times: number[], name: string = ''): Loop {
  return {
    name,
    length,
    hits: times.map(time => ({ time }))
  }
}

export function repeat(hitCount: number, name: string = ''): Loop {
  return loop(1, indexArray(hitCount).map(i => i / hitCount), name)
}

export function concat(loops: Loop[], name: string = ''): Loop {
  return loops.reduce((acc, loop) => {
    const offset = acc.length
    const shiftedHits = loop.hits.map(hit => ({
      time: offset + hit.time
    }))
    return {
      name,
      length: offset + loop.length,
      hits: acc.hits.concat(shiftedHits)
    }
  }, {
    name,
    length: 0,
    hits: []
  })
}

export const defaultLoops: Loop[] = [
  repeat(1, 'Single'),
  repeat(2, 'Double'),
  repeat(3, 'Triple'),
  repeat(4, 'Quad'),
]