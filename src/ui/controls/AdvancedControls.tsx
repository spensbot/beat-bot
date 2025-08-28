import { Button } from "@/components/ui/button"
import { useState } from "react"
import Debugger from "../debugger/Debugger"
import { LabeledSlider } from "../components/LabeledSlider"
import { useDispatch } from "react-redux"
import { useAppState } from "@/redux/hooks"
import { setInputLatency } from "@/redux/appSlice"
import { CountInSlider } from "./Controls"
import { Cog } from "lucide-react"

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
