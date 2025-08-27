import { Button } from "@/components/ui/button"
import { useState } from "react"
import Debugger from "../debugger/Debugger"
import { LabeledSlider } from "../components/LabeledSlider"
import { useDispatch } from "react-redux"
import { useAppState } from "@/redux/hooks"
import { setInputLatency } from "@/redux/appSlice"
import { CountInSlider } from "./Controls"

export default function AdvancedControls() {
  const [advanced, setAdvanced] = useState(false)

  const buttonText = advanced ? "Hide Advanced" : "Advanced"

  return (
    <>
      <Button onClick={() => setAdvanced(!advanced)}>{buttonText}</Button>
      {advanced && (
        <>
          <CountInSlider />
          {/* <InputLatencySlider /> */}
          <Debugger />
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
