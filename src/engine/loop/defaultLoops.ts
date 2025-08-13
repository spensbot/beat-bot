import { Loop_t } from "./Loop";
import { repeat } from "./LoopData";

export const defaultLoops: Loop_t[] = [
  basicRepeat('Singles', 1, 0.0),
  basicRepeat('Doubles', 2, 0.1),
  basicRepeat('Triples', 3, 0.3),
  basicRepeat('Quads', 4, 0.3),
]

function basicRepeat(name: string, divisor: number, difficulty: number): Loop_t {
  return {
    id: name,
    name,
    difficulty,
    beatsPerBar: 4,
    data: repeat(divisor, 4)
  }
}