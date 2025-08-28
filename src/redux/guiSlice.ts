import { MidiDevice } from '@/utils/midiUtils'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MidiState {
  status: 'notSupported' | 'permissionDenied' | 'loading' | 'success'
  devices?: MidiDevice[]
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
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setMidiState
} = guiSlice.actions

export default guiSlice.reducer