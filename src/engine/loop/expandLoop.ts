import { PerfTime, Tempo } from "@/utils/timeUtils"
import { LoopData_t, LoopNote_t } from "./LoopData"

export interface ExpandedNote_t {
  time: PerfTime // Absolute time in the session
  loopNote: LoopNote_t // The note that was hit
}

export function expandLoop(loop: LoopData_t, start: PerfTime, end: PerfTime, tempo: Tempo): ExpandedNote_t[] {
  const unrolled: ExpandedNote_t[] = []

  // Everything in seconds for easy math
  const start_s = start.duration.s()
  const end_s = end.duration.s()
  const beat_s = tempo.period.s() // Seconds per beat
  const loop_s = loop.beatLength * beat_s

  const loopCount = Math.ceil((end_s - start_s - 0.01) / loop_s)

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
