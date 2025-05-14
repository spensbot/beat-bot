import AudioEngine from "./AudioEngine"
import MidiEngine, { MidiPress } from "./MidiEngine"
import onNextGesture from "./onNextGesture"
import { store } from '../redux/store'
import { addPress, setTime } from "../redux/metronomeSlice"
import { KeyPress, KeyboardEngine } from "./KeyboardEngine"
import { PerfTime } from "../utils/timeUtils"
import Watched from "../utils/watched"
import { PlayState } from "../redux/MetronomeState"

export class Engine {
  audioEngine: AudioEngine = new AudioEngine()
  private midiEngine: MidiEngine = new MidiEngine()
  private keyboardEngine: KeyboardEngine = new KeyboardEngine()
  lastCursorRatio: number = 0
  animationHandle: number = 0
  playState = new Watched<PlayState>(() => store.getState().metronome.steady.playState)

  init() {
    console.log('init')

    this.audioEngine.init()
    this.midiEngine.init((press: MidiPress) => {
      store.dispatch(addPress(press))
    })
    this.keyboardEngine.init((press: KeyPress) => {
      store.dispatch(addPress(press))
    })

    const animate = () => {
      this.playState.ifUpdated((val) => {
        if (val === 'Playing') {
          console.log('playing')
          this.audioEngine.start()
        } else {
          this.audioEngine.stop()
        }
      })
      store.dispatch(setTime(PerfTime.now()))
      this.animationHandle = requestAnimationFrame(animate)
    }

    this.animationHandle = requestAnimationFrame(animate)
  }

  cleanup() {
    cancelAnimationFrame(this.animationHandle)
  }
}

const engine = new Engine()

onNextGesture(() => { engine.init() })

export default engine