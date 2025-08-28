import { MidiDevice } from '@/utils/midiUtils'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MidiState {
  status: 'notSupported' | 'permissionDenied' | 'loading' | 'success'
  devices?: MidiDevice[]
  /** Performance.now() */
  lastPressTime_s?: number
}

export interface GuiState {
  midi: MidiState
}

const initialState: GuiState = {
  midi: {
    status: 'loading'
  }
}

export const guiSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setMidiState: (state, action: PayloadAction<MidiState>) => {
      state.midi = action.payload
    },
    setLastPressTime_s: (state, action: PayloadAction<number>) => {
      state.midi.lastPressTime_s = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setMidiState,
  setLastPressTime_s
} = guiSlice.actions

export default guiSlice.reducer