import { Button } from "@/components/ui/button"
import { useState } from "react"
import Debugger from "../debugger/Debugger"
import { LabeledSlider } from "../components/LabeledSlider"
import { useDispatch } from "react-redux"
import { useAppState } from "@/redux/hooks"
import { setIgnoreExtraHits, setInputLatency } from "@/redux/appSlice"
import { CountInSlider, VisualizerLengthSlider } from "./Controls"
import { Cog } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdvancedControls() {
  const [advanced, setAdvanced] = useState(false)

  const buttonText = advanced ? "Hide Advanced" : "Advanced"
  return (
    <>
      <button
        onClick={() => setAdvanced(!advanced)}
        className="opacity-50 hover:opacity-80 active:opacity-100 cursor-pointer"
      >
        <Cog size={30} strokeWidth={1.75} />
      </button>
      {advanced && (
        <>
          <VisualizerLengthSlider />
          <CountInSlider />
          <IgnoreExtraHitsCheckbox />
          {/* <InputLatencySlider /> */}
          <div />
          {/* <Debugger /> */}
        </>
      )}
    </>
  )
}

/** WARNING: inputLatency_ms isn't used anywhere atm. */
function InputLatencySlider() {
  const dispatch = useDispatch()
  const inputLatency_ms = useAppState((s) => s.hardware.inputLatency_ms)

  return (
    <LabeledSlider
      value={inputLatency_ms}
      min={0}
      max={30}
      step={1}
      onChange={(value) => {
        dispatch(setInputLatency(value))
      }}
      label="Input Latency"
      valueString={(value) => `${Math.round(value)}ms`}
    />
  )
}

function IgnoreExtraHitsCheckbox() {
  const ignoreExtraHits = useAppState((s) => s.stats.ignoreExtraHits)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-row items-center gap-2">
      <Checkbox
        id="ignore-extra-hits"
        checked={ignoreExtraHits}
        onCheckedChange={(checked) =>
          dispatch(setIgnoreExtraHits(checked as boolean))
        }
      />
      <label
        htmlFor="ignore-extra-hits"
        className="select-none text-neutral-500"
      >
        Ignore Extra Hits
      </label>
    </div>
  )
}
