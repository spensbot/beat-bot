import { Tempo } from '../utils/timeUtils'
import { defaultLoops, Loop_t } from './loop/Loop'
import { Session_t } from './loop/Session'
import { VisualizerSettings } from './visualizer/VisualizerSettings'

export interface AppState {
  time: TimeSettings // General app settings
  metronome: MetronomeSettings // Settings for the metronome
  visualizer: VisualizerSettings
  loop: Loop_t
  activeSession?: Session_t
  pastSessions: Session_t[]
}

export interface TimeSettings {
  tempo: Tempo
  countInBeats: number
  loopRepeats: number
}

export interface MetronomeSettings {
  gain: number // Volume of the metronome
}

export const initialState: AppState = {
  time: {
    tempo: Tempo.bpm(120),
    countInBeats: 4, // How many beats to count in before starting the loop
    loopRepeats: 1, // How many times the loop should repeat
  },
  metronome: {
    gain: 0.5, // Volume of the metronome
  },
  visualizer: {
    length_s: 8,
    playheadRatio: 0.33,
  },
  loop: defaultLoops[0],
  pastSessions: [],
}
