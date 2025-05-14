import { useSelector } from "react-redux"
import { RootState } from "./store"
import { AnimatedState, MetronomeState, SteadyState, Layer } from "./MetronomeState"

export function useMetronome<T>(cb: (state: MetronomeState) => T) {
  return useSelector((state: RootState) => cb(state.metronome))
}

export function useAnimated<T>(cb: (state: AnimatedState) => T) {
  return useSelector((state: RootState) => cb(state.metronome.animated))
}

export function useSteady<T>(cb: (state: SteadyState) => T) {
  return useSelector((state: RootState) => cb(state.metronome.steady))
}

export function useLayer<T>(cb: (state: Layer) => T, index: number) {
  return useSelector((state: RootState) => cb(state.metronome.steady.layers[index]))
}

export { useDispatch } from "react-redux"