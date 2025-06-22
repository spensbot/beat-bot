import { MidiDevice, MidiMessage, parseMidiMessage } from '../../utils/midiUtils'
import { Press_t } from './InputEngine'

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

  async init(onPress: (press: Press_t) => void) {
    this.midiAccess = await navigator.requestMIDIAccess()

    onMidi(this.midiAccess, (message: MidiMessage) => {
      if (message.type === 'on') {
        onPress({
          t: 'Press',
          time: message.time,
          input: message.input,
          velocity: message.velocity
        })
      }
    })
  }
}
