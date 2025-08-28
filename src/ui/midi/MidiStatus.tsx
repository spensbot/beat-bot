import { MidiState } from "@/redux/guiSlice"
import { useGuiState } from "@/redux/hooks"
import { MidiDevice } from "@/utils/midiUtils"

export function MidiStatus() {
  const state = useGuiState((s) => s.midi)

  return <div>Midi: {statusText(state)}</div>
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
