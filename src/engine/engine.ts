import AudioEngine from "./audio/AudioEngine"
import onNextGesture from "./onNextGesture"
import { store } from '../redux/store'
import { addPress } from "../redux/appSlice"
import { InputEngine, Press_t } from "./input/InputEngine"
import { Duration, getPeriod_s, PerfTime } from "@/utils/timeUtils"
import { setLastPressTime_s } from "@/redux/guiSlice"

export class Engine {
  audioEngine: AudioEngine = new AudioEngine()
  inputEngine: InputEngine = new InputEngine()
  private _nextMetronomeTime: PerfTime = PerfTime.s(0)
  private _disposed: boolean = false
  private _sessionStartTime: PerfTime = PerfTime.s(0)

  init() {
    this.audioEngine.init()
    this.inputEngine.init((press: Press_t) => {
      store.dispatch(addPress(press))

      if (press.input.type === 'MidiInput') {
        store.dispatch(setLastPressTime_s(press.time.duration.s()))
      }
    })

    store.subscribe(() => {
      const appState = store.getState().app
      const sesh = appState.activeSession
      if (sesh && sesh.start !== this._sessionStartTime) {
        this._sessionStartTime = sesh.start
        this.audioEngine.playMetronomeSound(appState.metronome.gain, PerfTime.now())
      }
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

    const sesh = appState.activeSession

    if (sesh) {
      const delta = PerfTime.now().delta(sesh.start)

      const period_s = getPeriod_s(appState.time.tempo)
      const nextBeat = Math.floor(delta.s() / period_s) + 1
      const nextMetronomeTime = sesh.start.plus(Duration.s(nextBeat * period_s))

      if (!this._nextMetronomeTime.approxEquals(nextMetronomeTime, 0.01) && nextMetronomeTime.lessThan(sesh.end)) {
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