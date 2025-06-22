import AudioEngine from "./audio/AudioEngine"
import onNextGesture from "./onNextGesture"
import { store } from '../redux/store'
import { addPress } from "../redux/appSlice"
import { InputEngine, Press_t } from "./input/InputEngine"

export class Engine {
  audioEngine: AudioEngine = new AudioEngine()
  inputEngine: InputEngine = new InputEngine()
  private _unsubscribe: (() => void) | undefined

  init() {
    console.log('Engine init()')

    this.audioEngine.init()
    this.inputEngine.init((press: Press_t) => {
      store.dispatch(addPress(press))
    })

    this._unsubscribe = store.subscribe(() => {
      const state = store.getState().app

      const tempo = state.time.tempo
      const startTime = state.activeSession?.start
    })
  }

  dispose() {
    this._unsubscribe?.()
    this.inputEngine.dispose()
  }
}

const engine = new Engine()

onNextGesture(() => { engine.init() })

export default engine