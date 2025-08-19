import { getAudioContext, loadBuffer } from './audioUtils'
import metronomePath from '/metronome.mp3'
import { PerfTime } from '../../utils/timeUtils'

interface GraphData {
  ctx: AudioContext
  metronome: AudioBuffer
  gainNode: GainNode
}

async function createGraph(): Promise<GraphData> {
  const ctx = getAudioContext()
  const gainNode = ctx.createGain()
  const metronome = await loadBuffer(ctx, metronomePath)
  gainNode.connect(ctx.destination)

  return {
    ctx,
    gainNode,
    metronome
  }
}

export default class AudioEngine {
  graph: GraphData | null = null
  metronomeSource: AudioBufferSourceNode | null = null

  async init() {
    if (this.graph === null) {
      this.graph = await createGraph()
    } else {
      this.graph.ctx.resume()
    }
  }

  async playMetronomeSound(gain: number, perfTime: PerfTime) {
    await this.init()

    if (!this.graph) return

    const { ctx, metronome, gainNode } = this.graph
    const time = perfTime.toAudioTime(ctx)
    const source = ctx.createBufferSource()
    source.buffer = metronome
    source.connect(gainNode)

    gainNode.gain.setValueAtTime(gain, time.duration.s())
    source.start(time.duration.s())
    this.metronomeSource = source;
  }
}
