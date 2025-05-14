import { PerfTime } from "./timeUtils"

export type MessageType = 'off' | 'on' | 'key_pressure' | 'cc' | 'prog_change' | 'channel_pressure' | 'pitch_bend' | 'unknown'

const VELOCITY_MAX = 127

// Velocity from 0 to 1
function velocity(velocityInt: number) {
  return velocityInt / VELOCITY_MAX
}

function splitBits(number: number): [number, number] {
  // Mask to extract the first 4 bits
  const firstFourBitsMask = 0b11110000;
  // Mask to extract the last 4 bits
  const lastFourBitsMask = 0b00001111;

  // Extracting the first 4 bits by performing a bitwise AND with the mask
  const firstFourBits = (number & firstFourBitsMask) >> 4;
  // Extracting the last 4 bits by performing a bitwise AND with the mask
  const lastFourBits = number & lastFourBitsMask;

  return [firstFourBits, lastFourBits];
}

export interface MidiDevice {
  name: string
  mfg: string
  id: string
}

export interface MidiInput {
  type: 'MidiInput'
  channel: number
  note: number
  device: MidiDevice
}

export interface MidiMessage {
  time: PerfTime
  type: MessageType
  input: MidiInput
  velocity: number // 0-127
}

const messageTypeMap: { [key: number]: MessageType } = {
  0b1000: 'off',
  0b1001: 'on',
  0b1010: 'key_pressure',
  0b1011: 'cc',
  0b1100: 'prog_change',
  0b1101: 'channel_pressure',
  0b1110: 'pitch_bend'
}

export function parseMidiMessage(e: MIDIMessageEvent, device: MidiDevice): MidiMessage {
  const data = e.data ?? Uint8Array.from([0, 0, 0])
  const [typeInt, channel] = splitBits(data[0])
  const noteInt = data[1]
  const velocityInt = data[2]

  return {
    time: PerfTime.fromEvent(e),
    type: messageTypeMap[typeInt] ?? "unknown",
    input: {
      type: 'MidiInput',
      channel: channel,
      note: noteInt,
      device
    },
    velocity: velocity(velocityInt)
  }
}
