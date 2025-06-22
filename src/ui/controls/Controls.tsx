import { Button } from "@/components/ui/button"
import {
  endSession,
  setCountInBeats,
  setLoopRepeats,
  setTempo,
  startSession,
} from "@/redux/appSlice"
import { useDispatch } from "react-redux"
import { PerfTime, Tempo } from "@/utils/timeUtils"
import { useAppState } from "@/redux/hooks"
import { LabeledSlider } from "../components/LabeledSlider"

export default function Controls() {
  return (
    <>
      <PlayButton />
      <TempoSlider />
      <CountInSlider />
      <LoopRepeatsSlider />
    </>
  )
}

function PlayButton() {
  const dispatch = useDispatch()
  const isPlaying = useAppState((s) => s.activeSession !== undefined)

  const onClick = () => {
    if (isPlaying) {
      dispatch(endSession())
    } else {
      dispatch(startSession(PerfTime.now()))
    }
  }

  return <Button onClick={onClick}>{isPlaying ? "Stop" : "Play"}</Button>
}

function TempoSlider() {
  const dispatch = useDispatch()
  const tempo = useAppState((s) => s.time.tempo)

  return (
    <LabeledSlider
      value={tempo.bpm()}
      min={40}
      max={240}
      step={1}
      onChange={(value) => {
        dispatch(setTempo(Tempo.bpm(value)))
      }}
      label="BPM"
      valueString={(value) => `${Math.round(value)}`}
    />
  )
}

function CountInSlider() {
  const dispatch = useDispatch()
  const countInBeats = useAppState((s) => s.time.countInBeats)

  return (
    <LabeledSlider
      value={countInBeats}
      min={0}
      max={16}
      step={1}
      onChange={(value) => {
        dispatch(setCountInBeats(value))
      }}
      label="Count In Beats"
      valueString={(value) => `${Math.round(value)}`}
    />
  )
}

function LoopRepeatsSlider() {
  const dispatch = useDispatch()
  const loopRepeats = useAppState((s) => s.time.loopRepeats)

  return (
    <LabeledSlider
      value={loopRepeats}
      min={1}
      max={16}
      step={1}
      onChange={(value) => {
        dispatch(setLoopRepeats(value))
      }}
      label="Loop Repeats"
      valueString={(value) => `${Math.round(value)}`}
    />
  )
}
