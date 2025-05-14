import { Button } from "@/components/ui/button"
import { useSteady } from "@/redux/hooks"
import { setPlayState } from "@/redux/metronomeSlice"
import { useDispatch } from "react-redux"

export default function Controls() {
  const dispatch = useDispatch()
  const playState = useSteady((s) => s.playState)

  return (
    <div>
      <Button
        onClick={() =>
          dispatch(
            setPlayState(playState === "Playing" ? "Stopped" : "Playing")
          )
        }
      >
        {playState === "Playing" ? "Stop" : "Play"}
      </Button>
    </div>
  )
}
