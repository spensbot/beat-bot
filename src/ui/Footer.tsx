import { useDispatch } from "react-redux"
import { MidiStatus } from "./midi/MidiStatus"
import TooltipView from "./tooltips/TooltipView"
import { setTutorialStep } from "@/redux/guiSlice"
import { tutorialSteps } from "./tooltips/tooltips"
import TooltipWrapper from "./tooltips/TooltipWrapper"

export default function Footer() {
  return (
    <div className="w-full gap-2 border border-neutral-700 bg-emerald-950 px-2 flex items-center">
      <MidiStatus />
      <div className="grow" />
      <TooltipView />
      <TutorialButton />
    </div>
  )
}

function TutorialButton() {
  const dispatch = useDispatch()

  return (
    <TooltipWrapper tooltip="tutorial" className="bg-none">
      <button
        onClick={() => dispatch(setTutorialStep(tutorialSteps[0]))}
        className="border rounded-md px-4 bg-none"
      >
        Tutorial
      </button>
    </TooltipWrapper>
  )
}
