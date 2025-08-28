import { nextTutorialStep, TooltipKey, tutorialSteps } from '@/ui/tooltips/tooltips'
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
  tooltipStack: TooltipKey[]
  tutorialStep?: TooltipKey
}

const initialState: GuiState = {
  midi: {
    status: 'loading'
  },
  tooltipStack: [],
}

export const guiSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setMidiStatus: (state, action: PayloadAction<MidiState['status']>) => {
      state.midi.status = action.payload
    },
    setMidiSuccess: (state, action: PayloadAction<MidiDevice[]>) => {
      state.midi.status = 'success'
      state.midi.devices = action.payload
    },
    setLastPressTime_s: (state, action: PayloadAction<number>) => {
      state.midi.lastPressTime_s = action.payload
    },
    pushTooltip: (state, action: PayloadAction<TooltipKey>) => {
      state.tooltipStack.push(action.payload)
    },
    popTooltip: (state, action: PayloadAction<TooltipKey>) => {
      state.tooltipStack = state.tooltipStack.filter(t => t !== action.payload)
    },
    advanceTutorial: (state) => {
      if (!state.tutorialStep) return
      state.tutorialStep = nextTutorialStep(state.tutorialStep)
    },
    setTutorialStep: (state, action: PayloadAction<TooltipKey | undefined>) => {
      state.tutorialStep = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setMidiStatus,
  setMidiSuccess,
  setLastPressTime_s,
  pushTooltip,
  popTooltip,
  advanceTutorial,
  setTutorialStep
} = guiSlice.actions

export default guiSlice.reducer