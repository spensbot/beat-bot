import { useSelector } from "react-redux"
import { RootState } from "./store"
import { AppState } from "../engine/AppState"
import { GuiState } from "./guiSlice"

export function useAppState<T>(cb: (state: AppState) => T) {
  return useSelector((state: RootState) => cb(state.app))
}

export function useGuiState<T>(cb: (state: GuiState) => T) {
  return useSelector((state: RootState) => cb(state.gui))
}

export { useDispatch } from "react-redux"