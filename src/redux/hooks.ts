import { useSelector } from "react-redux"
import { RootState } from "./store"
import { AppState } from "../engine/AppState"

export function useAppState<T>(cb: (state: AppState) => T) {
  return useSelector((state: RootState) => cb(state.app))
}

export { useDispatch } from "react-redux"