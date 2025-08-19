import { LoopDataSchema } from "./LoopData"
import * as z from 'zod'

export const LoopIdSchema = z.string().brand("LoopId")
export type LoopId_t = z.infer<typeof LoopIdSchema>

export const LoopSchema = z.object({
  id: LoopIdSchema,
  name: z.string(),
  difficulty: z.number().min(0).max(1), // 0 to 1
  beatsPerBar: z.number().min(1), // At least one beat per bar
  data: LoopDataSchema
})

// Represents a loop of hits
export type Loop_t = z.infer<typeof LoopSchema>

