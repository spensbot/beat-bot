import { MidiInput } from '@/utils/midiUtils'
import { KeyInput } from './KeyboardEngine'
import { PerfTime } from '@/utils/timeUtils'
import { KeyboardEngine } from "./KeyboardEngine"
import MidiEngine from "./MidiEngine"

/** Where the input came from. Device, note, channel, etc. */
export type Input_t = MidiInput | KeyInput

export interface Press_t {
  t: 'Press'
  input: Input_t,
  velocity: number,
  time: PerfTime
}

export class InputEngine {
  private midiEngine: MidiEngine = new MidiEngine()
  private keyboardEngine: KeyboardEngine = new KeyboardEngine()

  init(onPress: (press: Press_t) => void) {
    this.midiEngine.init(onPress)
    this.keyboardEngine.init(onPress)
  }

  dispose() {
    this.keyboardEngine.dispose()
  }
}