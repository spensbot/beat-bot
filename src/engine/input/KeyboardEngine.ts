import { PerfTime } from "../../utils/timeUtils";
import { Press_t } from "./InputEngine";

const validKeys = new Set('qwertyuiopasdfghjkl;zxcvbnm'.split(''));

export interface KeyInput {
  type: 'KeyInput',
  key: string
}

export class KeyboardEngine {
  onKeyDown: (e: KeyboardEvent) => void = () => { }

  init(onKey: (e: Press_t) => void) {
    this.onKeyDown = (e: KeyboardEvent) => {
      e.timeStamp
      e.key
      if (validKeys.has(e.key)) {
        onKey({
          t: 'Press',
          input: {
            type: 'KeyInput',
            key: e.key
          },
          time: PerfTime.fromEvent(e),
          velocity: 1 // Default velocity for keyboard input
        })
      }
    }
    document.addEventListener('keydown', this.onKeyDown);
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}