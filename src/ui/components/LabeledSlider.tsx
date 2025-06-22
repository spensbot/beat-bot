import { Slider } from "@/components/ui/slider"

interface Props {
  label: string
  value: number
  valueString?: (value: number) => string
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

export function LabeledSlider({
  label,
  value,
  valueString,
  onChange,
  min,
  max,
  step,
}: Props) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex w-50 justify-between items-center">
        <p>{label}</p>
        {valueString && (
          <p className="opacity-80 text-sm">{valueString(value)}</p>
        )}
      </div>

      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(value) => {
          onChange(value[0])
        }}
        className="w-50"
      />
    </div>
  )
}
