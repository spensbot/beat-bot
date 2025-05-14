import { getAudioContext, loadBuffer } from './audioUtils'
import metronomePath from '/metronome.mp3'
import { store } from '../redux/store'
import { AudioTime, PerfTime, Duration, Tempo } from '../utils/timeUtils'
import { setScheduledBeat } from '../redux/metronomeSlice'

interface GraphData {
  ctx: AudioContext
  metronome: AudioBuffer
  gainNode: GainNode
}

async function createGraph(): Promise<GraphData> {
  console.log(`createGraph()`)
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
  nextClick = new PerfTime(Duration.s(0))
  tempo = Tempo.bpm(120)
  timeoutId: number | null = null
  graph: GraphData | null = null

  async init() {
    if (this.graph === null) {
      this.graph = await createGraph()
    } else {
      this.graph.ctx.resume()
    }
  }

  async start() {
    console.log('playing')

    await this.init()

    this.stop()

    const prepNextClick = (time: AudioTime) => {
      const { tempo, metronomeGain } = store.getState().metronome.steady
      this.tempo = tempo

      this.playMetronomeSound(metronomeGain, time)

      const period = tempo.period()

      const nextClickTime = time.plus(period)

      const interval = time.duration.minus(this.currentTime().duration)
      if (interval.s() < 0) {
        // weird things will start to happen and crashing is a much better alternative
        throw `Interval is < 0! -> ${interval}`
      }

      this.timeoutId = window.setTimeout(() => prepNextClick(nextClickTime), interval.ms())
    }

    const { tempo, metronomeGain } = store.getState().metronome.steady
    this.playMetronomeSound(metronomeGain, this.currentTime())
    this.tempo = tempo

    prepNextClick(this.currentTime().plus(tempo.period()))
  }

  stop() {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId)
    }
  }

  // Returns the how far the time is from the current time in beats
  beatRatio(time: PerfTime): number {
    if (this.graph) {
      const delta = time.duration.minus(this.nextClick.duration)
      return delta.s() / this.tempo.period().s()
    } else {
      return 0
    }
  }

  private currentTime(): AudioTime {
    if (this.graph) {
      const ctx = this.graph.ctx
      return AudioTime.now(ctx)
    } else {
      return AudioTime.zero()
    }
  }

  private playMetronomeSound(gain: number, time: AudioTime) {
    if (!this.graph) return

    const { ctx, metronome, gainNode } = this.graph

    const source = ctx.createBufferSource()
    source.buffer = metronome
    source.connect(gainNode)
    gainNode.gain.setValueAtTime(gain, time.duration.s())
    source.start(time.duration.s())
    this.nextClick = time.toPerf(ctx)
    store.dispatch(setScheduledBeat(this.nextClick))
  }
}
