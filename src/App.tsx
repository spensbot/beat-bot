import Controls from "./ui/controls/Controls"
import Visualizer from "./ui/visualizer/Visualizer"
import "./engine/engine"
import StatsView from "./ui/stats/StatsView"
import { LoopSelectView } from "./ui/controls/loop-select/LoopSelectView"
import LoopEval from "./ui/stats/LoopEval"
import Title from "./ui/Title"
import TutorialDimmer from "./ui/tooltips/TutorialDimmer"
import Footer from "./ui/Footer"

function App() {
  return (
    <div className="flex flex-col gap-4 w-screen h-screen bg-neutral-950 select-none">
      <Visualizer />
      <div className="min-h-0 grow shrink flex flex-row gap-4 px-4 w-full">
        <div className="flex flex-col gap-4">
          <Title />
          <LoopEval />
          <div className="min-h-0 grow shrink flex flex-row gap-4">
            <Controls />
            <StatsView />
          </div>
        </div>

        <LoopSelectView className="h-full grow overflow-y-scroll" />
      </div>
      <Footer />
      <TutorialDimmer />
    </div>
  )
}

export default App
