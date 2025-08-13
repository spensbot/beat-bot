import Controls from "./ui/controls/Controls"
// import Debugger from "./ui/debugger/Debugger"
import Visualizer from "./ui/visualizer/Visualizer"
import "./engine/engine"
import StatsView from "./ui/stats/StatsView"
import { LoopSelectView } from "./ui/controls/loop-select/LoopSelectView"

function App() {
  return (
    <div className="flex flex-col gap-4 h-screen">
      <Visualizer />
      <div className="flex flex-row gap-4 p-4">
        <Controls />
        {/* <Debugger /> */}
        <StatsView />
        <div className="grow">
          <LoopSelectView />
        </div>
      </div>
    </div>
  )
}

export default App
