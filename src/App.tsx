import Controls from "./ui/controls/Controls"
import Debugger from "./ui/debugger/Debugger"
import Visualizer from "./ui/visualizer/Visualizer"
import "./engine/engine"
import StatsView from "./ui/stats/StatsView"
import { LoopSelectView } from "./ui/controls/loop-select/LoopSelectView"

function App() {
  return (
    <div className="flex flex-col gap-4 w-screen h-screen bg-neutral-950">
      <Visualizer />
      <div className="min-h-0 grow shrink flex flex-row gap-4 px-4">
        <Controls />
        <StatsView />
        <LoopSelectView className="h-full grow overflow-y-scroll" />
      </div>
    </div>
  )
}

export default App
