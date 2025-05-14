import { PerfTime } from '../utils/timeUtils'
import { MidiDevice, MidiInput, MidiMessage, parseMidiMessage } from '../utils/midiUtils'

export interface MidiPress {
  type: 'MidiPress',
  input: MidiInput,
  velocity: number,
  time: PerfTime
}

function onMidi(access: MIDIAccess, cb: (message: MidiMessage) => void) {
  access.inputs.forEach(input => {
    const device: MidiDevice = {
      name: input.name ?? 'N/A',
      mfg: input.manufacturer ?? 'N/A',
      id: input.id
    }
    input.onmidimessage = e => {
      const message = parseMidiMessage(e as MIDIMessageEvent, device)
      cb(message)
    }
  })
}

export default class MidiEngine {
  midiAccess: MIDIAccess | null = null

  async init(onPress: (press: MidiPress) => void) {
    this.midiAccess = await navigator.requestMIDIAccess()

    onMidi(this.midiAccess, (message: MidiMessage) => {
      if (message.type === 'on') {
        onPress({
          type: 'MidiPress',
          time: message.time,
          input: message.input,
          velocity: message.velocity
        })
      }
    })
  }
}

// OUTPUT FOR CONTROLLING LEDS?
// Array.from(access.outputs.values()).forEach(output => {
//   for (let i=0; i<127; i++) {
//     output.send([0x90, 60, 127])
//   }
// })
