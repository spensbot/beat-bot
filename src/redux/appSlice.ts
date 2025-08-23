import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { PerfTime, Tempo } from '@/utils/timeUtils'
import { AppState, initialState, TimeSettings } from '@/engine/AppState'
import { Press_t } from '@/engine/input/InputEngine'
import { initSession, Session_t } from '@/engine/loop/Session'
import { Loop_t } from '@/engine/loop/Loop'
import { clamp } from '@/utils/math'
import { evaluateSession } from '@/engine/loop/SessionEval'
import { getSessionStats, SessionStats_t } from '@/engine/loop/SessionStats'

export const VISUALIZER_LENGTH_MIN = 2
export const VISUALIZER_LENGTH_MAX = 30

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setTempo: (state, action: PayloadAction<Tempo>) => {
      state.time.tempo = action.payload
    },
    setCountInBeats: (state, action: PayloadAction<number>) => {
      state.time.countInBeats = action.payload
    },
    setLoopRepeats: (state, action: PayloadAction<number>) => {
      state.time.loopRepeats = action.payload
    },
    setMetronomeGain: (state, action: PayloadAction<number>) => {
      state.metronome.gain = action.payload
    },
    startSession: (state, action: PayloadAction<PerfTime>) => {
      resetSession(state as AppState)
      state.activeSession = initSession(action.payload, state.loop, state.time as TimeSettings)
    },
    endSession: (state) => {
      resetSession(state as AppState)
    },
    addPress: (state, action: PayloadAction<Press_t>) => {
      state.activeSession?.presses.push(action.payload)
    },
    setSessionScrubTime: (state, action: PayloadAction<PerfTime>) => {
      if (state.activeSession) {
        state.activeSession.scrubTime = action.payload
      }
    },
    setVisualizerLength: (state, action: PayloadAction<number>) => {
      state.visualizer.length_s = clamp(action.payload, VISUALIZER_LENGTH_MIN, VISUALIZER_LENGTH_MAX)
    },
    setLoop: (state, action: PayloadAction<Loop_t>) => {
      resetSession(state as AppState)
      state.loop = action.payload
    },
    setInputLatency: (state, action: PayloadAction<number>) => {
      state.hardware.inputLatency_ms = action.payload
    }
  },
})

function resetSession(state: AppState) {
  if (state.activeSession === undefined) return

  const sessionEval = evaluateSession(state.activeSession, state.loop.data, state.time.tempo)
  state.activeSession = undefined
  if (sessionEval.matches.length < 1) return

  const sessionStats = getSessionStats(sessionEval)
  if (!state.sessionStatsByLoopId[state.loop.id]) {
    state.sessionStatsByLoopId[state.loop.id] = []
  }
  state.sessionStatsByLoopId[state.loop.id].push(sessionStats)
}

// Action creators are generated for each case reducer function
export const {
  setTempo,
  setCountInBeats,
  setLoopRepeats,
  setMetronomeGain,
  startSession,
  endSession,
  addPress,
  setSessionScrubTime,
  setVisualizerLength,
  setLoop,
  setInputLatency
} = appSlice.actions

export default appSlice.reducer