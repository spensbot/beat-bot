import { describe, it, expect } from "vitest";
import { getBeatMarkers, getLoopMarkers, getVisualizerCtx, getVisualizerRatio, VisualizerCtx } from "./visualizerUtils";
import { PerfTime, Tempo } from "@/utils/timeUtils";
import { VisualizerSettings } from "./VisualizerSettings";
import { Loop_t } from "../loop/Loop";

describe("getVisualizerCtx", () => {
  it("should calculate the correct visualizer context", () => {
    const start = PerfTime.s(10); // 10 seconds
    const now = PerfTime.s(20); // 20 seconds
    const visualizer: VisualizerSettings = {
      length_s: 10,
      playheadRatio: 0.5
    };

    const result = getVisualizerCtx(now, visualizer);

    expect(result.startTime_s).toBeCloseTo(15);
    expect(result.endTime_s).toBeCloseTo(25);
    expect(result.length_s).toBe(10);
  });

  it("should handle later times", () => {
    const start = PerfTime.s(0); // 20 seconds
    const now = PerfTime.s(30); // 30 seconds
    const visualizer: VisualizerSettings = {
      length_s: 10,
      playheadRatio: 0.5
    };

    const result = getVisualizerCtx(now, visualizer);

    expect(result.startTime_s).toBeCloseTo(25);
    expect(result.endTime_s).toBeCloseTo(35);
    expect(result.length_s).toBe(10);
  })

  it("should handle equal start and now times", () => {
    const start = PerfTime.s(10); // 10 seconds
    const now = PerfTime.s(10); // 10 seconds
    const visualizer: VisualizerSettings = {
      length_s: 10,
      playheadRatio: 0.5
    };

    const result = getVisualizerCtx(now, visualizer);

    expect(result.startTime_s).toBeCloseTo(5);
    expect(result.endTime_s).toBeCloseTo(15);
    expect(result.length_s).toBe(10);
  })
});

describe("getBeatMarkers", () => {
  it("should return correct beat markers for a given visualizer context and tempo", () => {
    const vis: VisualizerCtx = {
      startTime_s: 0,
      endTime_s: 10,
      length_s: 10
    };
    const start = PerfTime.s(0);
    const tempo = Tempo.bpm(30) // 2 seconds per beat

    const markers = getBeatMarkers(start, vis, tempo, 1);

    expect(markers).toHaveLength(5);
    expect(markers[0].time_s).toBe(0);
    expect(markers[1].time_s).toBe(2);
    expect(markers[2].time_s).toBe(4);
    expect(markers[3].time_s).toBe(6);
    expect(markers[4].time_s).toBe(8);
  })
});

describe("getVisualizerRatio", () => {
  it("should calculate the correct visualizer ratio", () => {
    const vis: VisualizerCtx = {
      startTime_s: 10,
      endTime_s: 20,
      length_s: 10
    };

    const time_s = 15;
    const result = getVisualizerRatio(time_s, vis);

    expect(result).toBeCloseTo(0.5);
  });
});