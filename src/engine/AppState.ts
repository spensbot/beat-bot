import { TempoSchema } from '../utils/timeUtils'
import { LoopSchema } from './loop/Loop'
import { Session_t } from './session/Session'
import { SessionStatsSchema } from './session/SessionStats'
import { defaultLoops } from './loop/defaultLoops'
import * as z from 'zod'

export const TimeSettingsSchema = z.object({
  tempo: TempoSchema,
  countInBeats: z.number().min(0, "Count in beats must be at least 0"),
  sessionBars: z.number().min(1, "bars must be at least 1")
})

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

export const StatsSettingsSchema = z.object({
  ignoreExtraHits: z.boolean().default(false), // Whether to ignore extra hits in the session stats
})

export type TimeSettings = z.infer<typeof TimeSettingsSchema>
export type VisualizerSettings = z.infer<typeof VisualizerSettingsSchema>
export type MetronomeSettings = z.infer<typeof MetronomeSettingsSchema>
export type HardwareSettings = z.infer<typeof HardwareSettingsSchema>
export type StatsSettings = z.infer<typeof StatsSettingsSchema>

export const PersistedAppStateSchema = z.object({
  time: TimeSettingsSchema,
  metronome: MetronomeSettingsSchema,
  visualizer: VisualizerSettingsSchema,
  loop: LoopSchema,
  sessionStatsByLoopId: z.record(z.string(), z.array(SessionStatsSchema)),
  hardware: HardwareSettingsSchema,
  stats: StatsSettingsSchema.default({ ignoreExtraHits: false }),
})

export type AppState = z.infer<typeof PersistedAppStateSchema> & {
  activeSession?: Session_t // Active session can be undefined
}

export const initialState: AppState = {
  time: {
    tempo: { bpm: 120 }, // Default tempo
    countInBeats: 4, // How many beats to count in before starting the loop
    sessionBars: 4, // How many times the loop should repeat
  },
  metronome: {
    gain: 0.5, // Volume of the metronome
  },
  visualizer: {
    length_s: 8,
    playheadRatio: 0.33,
  },
  loop: defaultLoops[1],
  sessionStatsByLoopId: {},
  hardware: {
    inputLatency_ms: 5, // Latency of the hardware input in milliseconds
  },
  stats: {
    ignoreExtraHits: false,
  },
}
