import * as z from 'zod'

export const NoteFilterIdSchema = z.string().brand("NoteFilterId")
export type NoteFilterId_t = z.infer<typeof NoteFilterIdSchema>

export const NoteFilterSchema = z.object({
  id: NoteFilterIdSchema,
  name: z.string(),
  notes: z.array(z.number()).optional()
})
export type NoteFilter_t = z.infer<typeof NoteFilterSchema>

export const LoopNoteSchema = z.object({
  beatTime: z.number().min(0, "Beat time must be at least 0"),
  filter: NoteFilterIdSchema.optional()
})
export type LoopNote_t = z.infer<typeof LoopNoteSchema>

export const LoopDataSchema = z.object({
  beatLength: z.number().min(0, "Beat length must be at least 0"),
  filtersById: z.record(NoteFilterIdSchema, NoteFilterSchema).optional(),
  notes: z.array(LoopNoteSchema)
})
export type LoopData_t = z.infer<typeof LoopDataSchema>

export function loopData(beatLength: number, beatTimes: number[]): LoopData_t {
  const filtersById: LoopData_t['filtersById'] = {}

  // for (const [, filterIdString] of beatTimes) {
  //   const filterId = filterIdString as NoteFilterId_t | undefined
  //   if (filterId && !(filterId in filtersById)) {
  //     filtersById[filterId] = {
  //       id: filterId,
  //       name: filterId
  //     }
  //   }
  // }

  return {
    beatLength,
    filtersById,
    notes: beatTimes.map((beatTime) => ({ beatTime }))
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
      beatLength: acc.beatLength + loop.beatLength,
      notes: acc.notes.concat(shiftedHits),
    }
  }, {
    beatLength: 0,
    notes: []
  })
}