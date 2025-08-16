import { useAnimatedValue } from "@/utils/hooks/useAnimationFrame"
import {
  AudioTime,
  Duration,
  PerfTime,
  timeDelta_perfToAudio,
} from "@/utils/timeUtils"
import engine from "@/engine/engine"
import cn from "@/utils/cn"

interface DebugTimeData {
  perfNow: PerfTime
  audio?: {
    now: AudioTime
    baseLatency: number
    outputLatency: number
    delta: Duration
  }
}

export default function Debugger({ className = "" }: { className?: string }) {
  const time = useAnimatedValue<DebugTimeData>(() => {
    const ctx = engine.audioEngine.graph?.ctx
    if (!ctx) {
      return {
        perfNow: PerfTime.now(),
      }
    }

    return {
      perfNow: PerfTime.now(),
      audio: {
        now: AudioTime.now(ctx),
        baseLatency: ctx.baseLatency,
        outputLatency: ctx.outputLatency,
        delta: timeDelta_perfToAudio(ctx),
      },
    }
  })

  return (
    <div className={cn("flex flex-col gap-1 text-sm", className)}>
      <Val
        name="performance.now"
        value={`${time.perfNow.duration.s().toFixed(3)}s`}
      />
      <Val
        name="audio.currentTime"
        value={`${time.audio?.now.duration.s().toFixed(3)}s`}
      />
      <Val name="delta" value={`${time.audio?.delta.s().toFixed(3)}s`} />
      <Val
        name="audio.baseLatency"
        value={`${time.audio?.baseLatency.toFixed(3)}s`}
      />
      <Val
        name="audio.outputLatency"
        value={`${time.audio?.outputLatency.toFixed(3)}s`}
      />
    </div>
  )
}

function Val({ name, value }: { name: string; value: string }) {
  return (
    <div className="font-mono">
      <p className="text-neutral-500">{name}: </p>
      <p className="opacity-80 text-sm">{value}</p>
    </div>
  )
}
