import { useDispatch } from "react-redux"
import { MidiStatus } from "./midi/MidiStatus"
import TooltipView from "./tooltips/TooltipView"
import { setTutorialStep } from "@/redux/guiSlice"
import { tutorialSteps } from "./tooltips/tooltips"

export default function Footer() {
  const dispatch = useDispatch()
  return (
    <div className="w-full gap-2 border border-neutral-700 bg-emerald-950 px-2 flex items-center">
      <MidiStatus />
      <div className="grow" />
      <TooltipView />
      <button
        onClick={() => dispatch(setTutorialStep(tutorialSteps[0]))}
        className="border rounded-md px-4"
      >
        Tutorial
      </button>
    </div>
  )
}
