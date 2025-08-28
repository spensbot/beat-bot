import { setMidiState } from '@/redux/guiSlice'
import { MidiDevice, MidiMessage, parseMidiMessage } from '../../utils/midiUtils'
import { Press_t } from './InputEngine'
import { store } from '@/redux/store'

function getDevices(access: MIDIAccess): MidiDevice[] {
  const devices: MidiDevice[] = []
  access.inputs.forEach(input => {
    const device: MidiDevice = {
      name: input.name ?? 'N/A',
      mfg: input.manufacturer ?? 'N/A',
      id: input.id
    }
    devices.push(device)
  })
  return devices
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

  init(onPress: (p: Press_t) => void) {
    setInterval(() => this.maintainConnection(onPress), 1000)
  }

  async maintainConnection(onPress: (p: Press_t) => void) {

    try {
      this.midiAccess = await navigator.requestMIDIAccess()

      store.dispatch(setMidiState({
        status: 'success',
        devices: getDevices(this.midiAccess)
      }))

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
    } catch {
      store.dispatch(setMidiState({
        status: 'permissionDenied'
      }))
    }
  }
}
