import { popTooltip, pushTooltip, advanceTutorial } from "@/redux/guiSlice"
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
import { StepForward } from "lucide-react"

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
        className={cn(className, isPopover && "bg-neutral-950")}
        onMouseEnter={() => dispatch(pushTooltip(tooltip))}
        onMouseLeave={() => dispatch(popTooltip(tooltip))}
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
          collisionPadding={30}
          avoidCollisions={true}
        >
          <div className="flex flex-col gap-4 p-5 bg-neutral-950 text-white rounded max-w-70 drop-shadow-black drop-shadow-lg">
            <p>{getTooltipText(tooltip)}</p>
            <Button
              onClick={() => dispatch(advanceTutorial())}
              className="animate-pulse duration-75 hover:animate-none hover:scale-105 transition-all"
            >
              Next <StepForward />
            </Button>
          </div>
          <Popover.Arrow className="w-5 h-3 fill-neutral-950" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
