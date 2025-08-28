import { useGuiState } from "@/redux/hooks"
import { getTooltipText } from "./tooltips"

export default function TooltipView() {
  const tooltip = useGuiState((s) => s.tooltipStack.at(-1))

  if (!tooltip) return null

  return (
    <div className="text-sm text-neutral-400">{getTooltipText(tooltip)}</div>
  )
}
