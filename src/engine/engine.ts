import AudioEngine from "./audio/AudioEngine"
import onNextGesture from "./onNextGesture"
import { store } from '../redux/store'
import { addPress } from "../redux/appSlice"
import { InputEngine, Press_t } from "./input/InputEngine"
import { Duration, PerfTime } from "@/utils/timeUtils"

export class Engine {
  audioEngine: AudioEngine = new AudioEngine()
  inputEngine: InputEngine = new InputEngine()
  private _nextMetronomeTime: PerfTime = PerfTime.s(0)
  private _disposed: boolean = false

  init() {
    console.log('Engine init()')

    this.audioEngine.init()
    this.inputEngine.init((press: Press_t) => {
      store.dispatch(addPress(press))
    })

    this.syncAudioOnAnimationFrame()
  }

  syncAudioOnAnimationFrame() {
    const syncAudioCb = () => {
      if (this._disposed) return
      this.syncAudio()
      requestAnimationFrame(syncAudioCb)
    }

    requestAnimationFrame(syncAudioCb)
  }

  syncAudio() {
    const appState = store.getState().app

    if (appState.activeSession) {
      const delta = PerfTime.now().delta(appState.activeSession.start)

      const period_s = appState.time.tempo.period.s()
      const nextBeat = Math.floor(delta.s() / period_s) + 1
      const nextMetronomeTime = appState.activeSession.start.plus(Duration.s(nextBeat * period_s))

      if (!this._nextMetronomeTime.approxEquals(nextMetronomeTime, 0.01)) {
        this._nextMetronomeTime = nextMetronomeTime
        this.audioEngine.playMetronomeSound(appState.metronome.gain, nextMetronomeTime)
      }
    }
  }

  dispose() {
    this._disposed = true
    this.inputEngine.dispose()
  }
}

const engine = new Engine()

onNextGesture(() => { engine.init() })

export default engine