import { PerfTime, Tempo } from "@/utils/timeUtils";
import { VisualizerSettings } from "./VisualizerSettings";

export interface BeatMarker {
  divisor: number; // The divisor for the beat marker (e.g., 1, 2, 4, 8)
  ratio: number; // The position of the beat marker as a ratio of the visualizer length
}

export function getBeatMarkers(
  startTime: PerfTime,
  currentTime: PerfTime,
  tempo: Tempo,
  visualizer: VisualizerSettings,
  divisionDepth: number): BeatMarker[] {

  const markers: BeatMarker[] = []

  const period_s = tempo.period.s();

  const timeSinceStart_s = currentTime.duration.s() - startTime.duration.s();

  const visualizerStart_s = timeSinceStart_s - visualizer.length_s * visualizer.playheadRatio;

  const visualizerEnd_s = startTime.duration.s() + visualizer.length_s * (1 - visualizer.playheadRatio);

  let beatTime = Math.ceil(visualizerStart_s / period_s) * period_s;

  while (beatTime < visualizerEnd_s) {
    markers.push({
      divisor: 1,
      ratio: (beatTime - visualizerStart_s) / visualizer.length_s
    })
    beatTime += period_s;
  }

  return markers
}