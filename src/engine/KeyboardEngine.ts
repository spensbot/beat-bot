import { PerfTime } from "../utils/timeUtils";

const validKeys = new Set('qwertyuiopasdfghjkl;zxcvbnm'.split(''));

export interface KeyInput {
  type: 'KeyInput',
  key: string
}

export interface KeyPress {
  type: 'KeyPress',
  input: KeyInput,
  time: PerfTime
}

export class KeyboardEngine {
  onKeyDown: (e: KeyboardEvent) => void = () => { }

  init(onKey: (e: KeyPress) => void) {
    this.onKeyDown = (e: KeyboardEvent) => {
      e.timeStamp
      e.key
      if (validKeys.has(e.key)) {
        onKey({
          type: 'KeyPress',
          input: {
            type: 'KeyInput',
            key: e.key
          },
          time: PerfTime.fromEvent(e)
        })
      }
    }
    document.addEventListener('keydown', this.onKeyDown);
  }

  cleanup() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}