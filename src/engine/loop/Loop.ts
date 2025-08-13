import { LoopData_t } from "./LoopData"

// Represents a loop of hits
export interface Loop_t {
  id: string
  name: string
  difficulty: number // 0 to 1
  beatsPerBar: number
  data: LoopData_t
}