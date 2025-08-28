import { MidiState } from "@/redux/guiSlice"
import { useGuiState } from "@/redux/hooks"
import { useAnimatedValue } from "@/utils/hooks/useAnimationFrame"
import { MidiDevice } from "@/utils/midiUtils"
import { PerfTime } from "@/utils/timeUtils"
import { KeyboardMusic } from "lucide-react"

export function MidiStatus() {
  const state = useGuiState((s) => s.midi)
  const pressedRecently = useAnimatedValue(() => {
    const timeSinceLastPress =
      PerfTime.now().duration.s() - (state.lastPressTime_s ?? 0)
    return timeSinceLastPress < 1
  })

  return (
    <div className="flex items-center gap-1">
      <KeyboardMusic
        color={pressedRecently ? "#ff8" : "#777"}
        strokeWidth={1.5}
      />
      <p className="text-neutral-500">Midi: {statusText(state)}</p>
    </div>
  )
}

function statusText({ status, devices }: MidiState): string {
  switch (status) {
    case "loading":
      return "Loading"
    case "notSupported":
      return "Not Supported. Use a real browser like Google Chrome"
    case "permissionDenied":
      return "Accept the permission dialog to use MIDI"
    case "success":
      return deviceText(devices!)
  }
}

function deviceText(devices: MidiDevice[]): string {
  const n = devices.length
  if (n === 0) return "no devices"

  return devices.map((d) => d.name).join(", ")
}
