import { defaultLoops } from "@/engine/loop/defaultLoops"

export function LoopSelectView() {
  return (
    <div>
      LoopSelectView
      {defaultLoops.map((loop) => (
        <LoopView key={loop.id} />
      ))}
    </div>
  )
}

function LoopView() {
  return (
    <div>
      Loop View
      <LoopPreview />
    </div>
  )
}

function LoopPreview() {
  return <div>LoopPreview</div>
}
