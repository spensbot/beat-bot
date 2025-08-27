import { Stats } from "@/utils/Stats";
import { Loop_t, LoopId_t } from "./Loop";
import { concat, repeat } from "./LoopData";

const singles = basicRepeat('1/4 notes', 1, 0.0)
const doubles = basicRepeat('1/8 notes', 2, 0.1)
const triples = basicRepeat('Triplets', 3, 0.3)
const quads = basicRepeat('1/16 notes', 4, 0.3)

export const defaultLoops: Loop_t[] = [
  singles,
  doubles,
  triples,
  quads,
  alternate([singles, doubles], 2),
  alternate([doubles, quads], 2),
  alternate([singles, quads], 2),
  alternate([doubles, triples], 2),
  alternate([triples, quads], 2)
]

function basicRepeat(name: string, divisor: number, difficulty: number, length: number = 1): Loop_t {
  return {
    id: name as LoopId_t,
    name,
    difficulty,
    beatsPerBar: 4,
    data: repeat(divisor, length)
  }
}

function alternate(loops: Loop_t[], repeat: number): Loop_t {
  const name = loops.map(l => l.name).join(', ')

  const repeatedLoops = loops.map(l => Array(repeat).fill(l)).flat()

  return concatLoops(name, repeatedLoops)
}

function concatLoops(name: string, loops: Loop_t[]): Loop_t {
  return {
    id: name as LoopId_t,
    name,
    difficulty: Stats.max(loops.map(l => l.difficulty)) + 0.1,
    beatsPerBar: loops[0].beatsPerBar,
    data: concat(loops.map(l => l.data))
  }
}