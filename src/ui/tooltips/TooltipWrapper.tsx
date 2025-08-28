import { popTooltip, pushTooltip, setTutorialStep } from "@/redux/guiSlice"
import {
  getTooltipText,
  nextTutorialStep,
  TooltipKey,
  tutorialSteps,
} from "@/ui/tooltips/tooltips"
import { useDispatch } from "react-redux"
import { Popover } from "radix-ui"
import { zIndex } from "../zIndex"
import { useGuiState } from "@/redux/hooks"
import { Button } from "@/components/ui/button"
import cn from "@/utils/cn"

export default function TooltipWrapper({
  tooltip,
  children,
  className,
}: {
  tooltip: TooltipKey
  children: React.ReactNode
  className?: string
}) {
  const dispatch = useDispatch()

  const isTutorialStep = tutorialSteps.includes(tooltip)

  const isPopover = useGuiState((s) => s.tutorialStep === tooltip)

  if (!isTutorialStep) {
    return (
      <div
        onMouseEnter={() => dispatch(pushTooltip(tooltip))}
        onMouseLeave={() => dispatch(popTooltip(tooltip))}
        className={className}
      >
        {children}
      </div>
    )
  }

  return (
    <Popover.Root open={isPopover}>
      <Popover.Anchor
        style={{ zIndex: isPopover ? zIndex.tooltip : undefined }}
        className={cn(className, "bg-neutral-950")}
      >
        {children}
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          style={{
            zIndex: isPopover ? zIndex.tooltip : undefined,
            outline: "none",
          }}
          sideOffset={10}
          side={tooltip === "exercise-select" ? "left" : undefined}
        >
          <div className="flex flex-col gap-2 p-5 bg-gray-800 text-white rounded max-w-70 drop-shadow-black drop-shadow-lg">
            <p>{getTooltipText(tooltip)}</p>
            <Button
              onClick={() =>
                dispatch(setTutorialStep(nextTutorialStep(tooltip)))
              }
            >
              Next
            </Button>
          </div>
          <Popover.Arrow className="w-5 h-3 fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
