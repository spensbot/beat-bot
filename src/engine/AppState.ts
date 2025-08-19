import { Tempo } from '../utils/timeUtils'
import { Loop_t } from './loop/Loop'
import { Session_t } from './loop/Session'
import { defaultLoops } from './loop/defaultLoops'
import * as z from 'zod'

export interface AppState {
  time: TimeSettings // General app settings
  metronome: MetronomeSettings // Settings for the metronome
  visualizer: VisualizerSettings
  loop: Loop_t
  activeSession?: Session_t
  pastSessions: Session_t[]
  hardware: HardwareSettings // Settings for the hardware input
}

export interface TimeSettings {
  tempo: Tempo
  countInBeats: number
  loopRepeats: number
}

export const VisualizerSettingsSchema = z.object({
  length_s: z.number().min(0), // how many seconds can be seen on the visualizer at once
  playheadRatio: z.number().min(0).max(1) // how far the playhead is from the start of visualizerLength
})

export const MetronomeSettingsSchema = z.object({
  gain: z.number().min(0).max(1) // Volume of the metronome
})

export const HardwareSettingsSchema = z.object({
  inputLatency_ms: z.number().min(0) // Latency of the hardware input
})

export type VisualizerSettings = z.infer<typeof VisualizerSettingsSchema>
export type MetronomeSettings = z.infer<typeof MetronomeSettingsSchema>
export type HardwareSettings = z.infer<typeof HardwareSettingsSchema>

export const initialState: AppState = {
  time: {
    tempo: Tempo.bpm(90),
    countInBeats: 4, // How many beats to count in before starting the loop
    loopRepeats: 4, // How many times the loop should repeat
  },
  metronome: {
    gain: 0.5, // Volume of the metronome
  },
  visualizer: {
    length_s: 8,
    playheadRatio: 0.33,
  },
  loop: defaultLoops[1],
  pastSessions: [],
  hardware: {
    inputLatency_ms: 5, // Latency of the hardware input in milliseconds
  },
}
