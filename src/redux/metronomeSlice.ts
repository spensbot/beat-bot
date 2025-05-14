import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PerfTime, Tempo } from '../utils/timeUtils'
import { isTimeInVisualizer } from '../utils/visualizerUtils'
import { Layer, MetronomeState, Press_t, isInputEqual, initialState, initLayer, PlayState } from './MetronomeState'
import { deleteElement } from '../utils/listUtils'

function removePressesOutsideWindow(state: MetronomeState) {
  for (const layer of state.steady.layers) {
    layer.presses = layer.presses.filter(
      press => isTimeInVisualizer(state, press.time)
    )
  }
}

function doesLayerAcceptPress(layer: Layer, press: Press_t): boolean {
  if (layer.inputs.length === 0) return true
  for (const input of layer.inputs) {
    if (isInputEqual(input, press.input)) return true
  }
  return false
}

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<PerfTime>) => {
      state.animated.time = action.payload
    },
    setTempo: (state, action: PayloadAction<Tempo>) => {
      state.steady.tempo = action.payload
    },
    setMetronomeGain: (state, action: PayloadAction<number>) => {
      state.steady.metronomeGain = action.payload
    },
    addLayer: (state) => {
      state.steady.layers.push(initLayer())
    },
    deleteLayer: (state, action: PayloadAction<number>) => {
      deleteElement(state.steady.layers, action.payload)
    },
    addPress: (state, action: PayloadAction<Press_t>) => {
      removePressesOutsideWindow(state as MetronomeState)

      const press = action.payload
      for (const layer of state.steady.layers) {
        if (doesLayerAcceptPress(layer as Layer, press)) {
          layer.presses.push(press)
        }
      }
    },
    setVisualizerLength: (state, action: PayloadAction<number>) => {
      state.steady.visualizerLength = action.payload
    },
    setScheduledBeat: (state, action: PayloadAction<PerfTime>) => {
      state.steady.scheduledBeat = action.payload
    },
    setPlayState: (state, action: PayloadAction<PlayState>) => {
      state.steady.playState = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setTime,
  setTempo,
  setMetronomeGain,
  addLayer,
  deleteLayer,
  addPress,
  setVisualizerLength,
  setScheduledBeat,
  setPlayState
} = noteSlice.actions

export default noteSlice.reducer