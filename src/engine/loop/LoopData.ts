import * as z from 'zod'

export const LoopNoteSchema = z.object({
  beatTime: z.number().min(0, "Beat time must be at least 0")
})
export type LoopNote_t = z.infer<typeof LoopNoteSchema>

export const LoopDataSchema = z.object({
  beatLength: z.number().min(0, "Beat length must be at least 0"),
  notes: z.array(LoopNoteSchema)
})
export type LoopData_t = z.infer<typeof LoopDataSchema>

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