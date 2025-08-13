export interface LoopNote_t {
  // Could add note, duration, velocity, etc in future
  beatTime: number // beats. Should be less than loop length.
}

export interface LoopData_t {
  beatLength: number // beats
  notes: LoopNote_t[] // beats. start inclusive, end exclusive.
}

export function loopData(beatLength: number, beatTimes: number[]): LoopData_t {
  return {
    beatLength,
    notes: beatTimes.map(beatTime => ({ beatTime }))
  }
}

export function repeat(division: number, beatLength: number): LoopData_t {
  const period = 1 / division
  const end = beatLength - 0.0001 // A little bit of 
  const beatTimes: number[] = []
  for (let beatTime = 0; beatTime < end; beatTime += period) {
    beatTimes.push(beatTime)
  }
  return loopData(beatLength, beatTimes)
}

export function concat(loops: LoopData_t[]): LoopData_t {
  return loops.reduce((acc, loop) => {
    const offset = acc.beatLength
    const shiftedHits = loop.notes.map(hit => ({
      beatTime: offset + hit.beatTime
    }))
    return {
      beatLength: offset + loop.beatLength,
      notes: acc.notes.concat(shiftedHits),
    }
  }, {
    beatLength: 0,
    notes: []
  })
}