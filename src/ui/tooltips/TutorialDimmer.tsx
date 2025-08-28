import { useDispatch, useGuiState } from "@/redux/hooks"
import { zIndex } from "../zIndex"
import { advanceTutorial } from "@/redux/guiSlice"
import { nextTutorialStep } from "./tooltips"

export default function TutorialDimmer() {
  const dispatch = useDispatch()
  const tutorialStep = useGuiState((s) => s.tutorialStep)
  const isOn = tutorialStep !== undefined

  if (!isOn) return null

  const advanceTutorial_ = () => dispatch(advanceTutorial())

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen"
      style={{
        zIndex: zIndex.tooltipDimmer,
        backgroundColor: "#8888",
      }}
      // onClick={advanceTutorial_}
    />
  )
}
