import { Stats } from "@/utils/Stats";
import { Loop_t } from "./Loop";
import { concat, repeat } from "./LoopData";
import { insertBetween } from "@/utils/listUtils";

const singles = basicRepeat('Singles', 1, 0.0)
const doubles = basicRepeat('Doubles', 2, 0.1)
const triples = basicRepeat('Triples', 3, 0.3)
const quads = basicRepeat('Quads', 4, 0.3)

export const defaultLoops: Loop_t[] = [
  singles,
  doubles,
  triples,
  quads,
  alternate([singles, doubles]),
  alternate([doubles, quads]),
  alternate([singles, quads]),
  alternate([doubles, triples]),
  alternate([triples, quads])
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

function alternate(loops: Loop_t[]): Loop_t {
  const name = loops.map(l => l.name).join(', ')
  return concatLoops(name, loops)
}

function concatLoops(name: string, loops: Loop_t[]): Loop_t {
  return {
    id: name,
    name,
    difficulty: Stats.max(loops.map(l => l.difficulty)) + 0.1,
    beatsPerBar: loops[0].beatsPerBar,
    data: concat(loops.map(l => l.data))
  }
}