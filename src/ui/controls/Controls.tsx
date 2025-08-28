import { Button } from "@/components/ui/button"
import {
  endSession,
  setCountInBeats,
  setSessionBars,
  setTempo,
  setVisualizerLength,
  startSession,
  VISUALIZER_LENGTH_MAX,
  VISUALIZER_LENGTH_MIN,
} from "@/redux/appSlice"
import { useDispatch } from "react-redux"
import { PerfTime, Tempo } from "@/utils/timeUtils"
import { useAppState } from "@/redux/hooks"
import { LabeledSlider } from "../components/LabeledSlider"
import { useAnimatedValue } from "@/utils/hooks/useAnimationFrame"
import AdvancedControls from "./AdvancedControls"
import { Play, Square, RotateCcw } from "lucide-react"
import TooltipWrapper from "../tooltips/TooltipWrapper"

export default function Controls() {
  return (
    <div className="flex flex-col gap-4 min-h-0 grow shrink max-w-50">
      <PlayButton />
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
        <TempoSlider />
        <LoopRepeatsSlider />
        <VisualizerLengthSlider />
        <AdvancedControls />
      </div>
    </div>
  )
}

type PlayState_t = "idle" | "playing" | "stopped"

function PlayButton() {
  const dispatch = useDispatch()
  const end = useAppState((s) => s.activeSession?.end)
  const playState = useAnimatedValue<PlayState_t>(() => {
    if (end === undefined) return "idle"
    return PerfTime.now().lessThan(end) ? "playing" : "stopped"
  })

  const onClick = () => {
    if (playState === "idle") {
      dispatch(startSession(PerfTime.now()))
    } else {
      dispatch(endSession())
    }
  }

  const buttonText = (): string => {
    switch (playState) {
      case "idle":
        return "Play"
      case "playing":
        return "Stop"
      case "stopped":
        return "Reset"
    }
  }

  const size = "size-4.5"

  const icon = (): React.ReactNode => {
    switch (playState) {
      case "idle":
        return <Play className={size} />
      case "playing":
        return <Square className={size} />
      case "stopped":
        return <RotateCcw className={size} />
    }
  }

  return (
    <TooltipWrapper tooltip="play-button">
      <Button className="w-50" onClick={onClick} size="lg">
        {icon()}
        <p className="text-l">{buttonText()}</p>
      </Button>
    </TooltipWrapper>
  )
}

function TempoSlider() {
  const dispatch = useDispatch()
  const tempo = useAppState((s) => s.time.tempo)
  const disabled = useAppState((s) => s.activeSession !== undefined)

  return (
    <LabeledSlider
      value={tempo.bpm}
      min={40}
      max={240}
      step={1}
      onChange={(value) => {
        dispatch(setTempo({ bpm: value }))
      }}
      label="BPM"
      valueString={(value) => `${Math.round(value)}`}
      disabled={disabled}
    />
  )
}

export function CountInSlider() {
  const dispatch = useDispatch()
  const countInBeats = useAppState((s) => s.time.countInBeats)
  const disabled = useAppState((s) => s.activeSession !== undefined)

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
      disabled={disabled}
    />
  )
}

function LoopRepeatsSlider() {
  const dispatch = useDispatch()
  const sessionBars = useAppState((s) => s.time.sessionBars)
  const disabled = useAppState((s) => s.activeSession !== undefined)

  return (
    <LabeledSlider
      value={sessionBars}
      min={1}
      max={16}
      step={1}
      onChange={(value) => {
        dispatch(setSessionBars(value))
      }}
      label="Bars"
      valueString={(value) => `${Math.round(value)}`}
      disabled={disabled}
    />
  )
}

function VisualizerLengthSlider() {
  const dispatch = useDispatch()
  const visualizerLength = useAppState((s) => s.visualizer.length_s)

  return (
    <LabeledSlider
      value={visualizerLength}
      min={VISUALIZER_LENGTH_MIN}
      max={VISUALIZER_LENGTH_MAX}
      step={0.1}
      onChange={(value) => {
        dispatch(setVisualizerLength(value))
      }}
      label="Zoom"
      valueString={(value) => `${value.toFixed(1)}s`}
    />
  )
}
