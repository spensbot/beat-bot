import { setMidiStatus, setMidiSuccess } from '@/redux/guiSlice'
import { MidiDevice, parseMidiMessage } from '../../utils/midiUtils'
import { Press_t } from './InputEngine'
import { store } from '@/redux/store'

function midiInputs(access: MIDIAccess): MIDIInput[] {
  const inputs: MIDIInput[] = []
  access.inputs.forEach(input => {
    inputs.push(input)
  })
  return inputs
}

function toDevice(input: MIDIInput): MidiDevice {
  return {
    name: input.name ?? 'N/A',
    mfg: input.manufacturer ?? 'N/A',
    id: input.id
  }
}

export default class MidiEngine {
  midiAccess: MIDIAccess | null = null
  inputs: MIDIInput[] = []

  init(onPress: (p: Press_t) => void) {
    setInterval(() => this.maintainConnection(onPress), 1000)
  }

  async maintainConnection(onPress: (p: Press_t) => void) {
    try {
      this.midiAccess = await navigator.requestMIDIAccess()

      const inputs = midiInputs(this.midiAccess)

      store.dispatch(setMidiSuccess(inputs.map(toDevice)))

      inputs.forEach(input => {
        if (this.inputs.find(i => i.id === input.id)) return

        this.inputs.push(input)
        console.log('MIDI Input connected: ', input.id)

        input.onmidimessage = e => {
          const message = parseMidiMessage(e as MIDIMessageEvent, toDevice(input))
          if (message.type === 'on') {
            onPress({
              t: 'Press',
              time: message.time,
              input: message.input,
              velocity: message.velocity
            })
          }
        }
      })
    } catch {
      store.dispatch(setMidiStatus('permissionDenied'))
    }
  }
}
