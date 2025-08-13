import { Button } from "@/components/ui/button"
import { defaultLoops } from "@/engine/loop/defaultLoops"
import { Loop_t } from "@/engine/loop/Loop"
import LoopPreview from "./LoopPreview"
import { useDispatch } from "react-redux"
import { setLoop } from "@/redux/appSlice"

export function LoopSelectView() {
  return (
    <div>
      {defaultLoops.map((loop) => (
        <LoopView key={loop.id} loop={loop} />
      ))}
    </div>
  )
}

function LoopView({ loop }: { loop: Loop_t }) {
  const dispatch = useDispatch()

  return (
    <div className="flex items-center gap-2 border-b border-b-blue-300 w-full">
      <div className="flex flex-col gap-1">
        <strong>{loop.name}</strong>
        <Difficulty val={loop.difficulty} />
      </div>

      {/* <BeatsPerBar val={loop.beatsPerBar} /> */}
      <LoopPreview data={loop.data} />
      <Button onClick={() => dispatch(setLoop(loop))}>Load</Button>
    </div>
  )
}

function Difficulty({ val }: { val: number }) {
  return (
    <div>
      <div className="h-2 bg-amber-400" style={{ width: val * 100 }} />
    </div>
  )
}

function BeatsPerBar({ val }: { val: number }) {
  return <div>{val}</div>
}
