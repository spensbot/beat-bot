import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { PerfTime, Tempo } from '@/utils/timeUtils'
import { initialState, TimeSettings } from '@/engine/AppState'
import { Press_t } from '@/engine/input/InputEngine'
import { initSession, Session_t } from '@/engine/loop/Session'
import { evaluateSession } from '@/engine/loop/SessionEval'

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
      if (state.activeSession) {
        state.pastSessions.push(state.activeSession)
      }
      state.activeSession = initSession(action.payload, state.loop, state.time as TimeSettings)
    },
    endSession: (state) => {
      if (state.activeSession) {
        state.pastSessions.push(state.activeSession)
      }
      state.activeSession = undefined
    },
    addPress: (state, action: PayloadAction<Press_t>) => {
      state.activeSession?.presses.push(action.payload)

      if (state.activeSession) {
        state.activeSession.eval = evaluateSession(state.activeSession as Session_t, state.loop, state.time.tempo as Tempo)
      }
    },
    setVisualizerLength: (state, action: PayloadAction<number>) => {
      state.visualizer.length_s = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setTempo,
  setCountInBeats,
  setLoopRepeats,
  setMetronomeGain,
  startSession,
  endSession,
  addPress,
  setVisualizerLength,
} = appSlice.actions

export default appSlice.reducer