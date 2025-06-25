import { PerfTime, Tempo } from "@/utils/timeUtils";
import { VisualizerSettings } from "./VisualizerSettings";

/** The base required for drawing time points on a visualizer */
export interface VisualizerCtx {
  startTime_s: number
  endTime_s: number
  length_s: number
}

export function getVisualizerCtx(now: PerfTime, visualizer: VisualizerSettings): VisualizerCtx {
  const visualizerStart_s = now.duration.s() - visualizer.length_s * visualizer.playheadRatio;
  const visualizerEnd_s = visualizerStart_s + visualizer.length_s;

  return {
    startTime_s: visualizerStart_s,
    endTime_s: visualizerEnd_s,
    length_s: visualizer.length_s
  }
}

export interface BeatMarker {
  divisor: number; // The divisor for the beat marker (e.g., 1, 2, 4, 8)
  time_s: number;
}

export function getBeatMarkers(
  start: PerfTime,
  vis: VisualizerCtx,
  tempo: Tempo,
  divisionDepth: number): BeatMarker[] {
  const markers: BeatMarker[] = []

  const period_s = tempo.period.s();

  let beatTime = Math.floor((vis.startTime_s - start.duration.s()) / period_s) * period_s + start.duration.s();

  while (beatTime < vis.endTime_s) {
    markers.push({
      divisor: 1,
      time_s: beatTime
    })
    beatTime += period_s;
  }

  return markers
}

export function getVisualizerRatio(time_s: number, vis: VisualizerCtx): number {
  return (time_s - vis.startTime_s) / vis.length_s;
}