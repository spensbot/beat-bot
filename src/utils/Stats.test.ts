import { describe, it, expect } from "vitest";
import { Stats } from "./Stats";

describe("Stats.mean", () => {
  it("returns 0 for empty array", () => {
    expect(Stats.mean([])).toBe(0);
  });

  it("returns the value for single element array", () => {
    expect(Stats.mean([5])).toBe(5);
  });

  it("returns correct mean for multiple values", () => {
    expect(Stats.mean([1, 2, 3, 4, 5])).toBe(3);
    expect(Stats.mean([2, 4, 6, 8])).toBe(5);
  });
});

describe("Stats.variance", () => {
  it("returns 0 for empty array", () => {
    expect(Stats.variance([])).toBe(0);
  });

  it("returns 0 for single element array", () => {
    expect(Stats.variance([7])).toBe(0);
  });

  it("returns correct variance for multiple values", () => {
    // For [1,2,3,4,5], mean=3, variance=((2^2)+(1^2)+(0^2)+(1^2)+(2^2))/5=2
    expect(Stats.variance([1, 2, 3, 4, 5])).toBe(2);
    // For [2,4,6,8], mean=5, variance=((3^2)+(1^2)+(1^2)+(3^2))/4=5
    expect(Stats.variance([2, 4, 6, 8])).toBe(5);
  });
});

describe("Stats.stdDev", () => {
  it("returns 0 for empty array", () => {
    expect(Stats.stdDev([])).toBe(0);
  });

  it("returns 0 for single element array", () => {
    expect(Stats.stdDev([10])).toBe(0);
  });

  it("returns correct standard deviation for multiple values", () => {
    // For [1,2,3,4,5], variance=2, stdDev=sqrt(2)
    expect(Stats.stdDev([1, 2, 3, 4, 5])).toBeCloseTo(Math.sqrt(2));
    // For [2,4,6,8], variance=5, stdDev=sqrt(5)
    expect(Stats.stdDev([2, 4, 6, 8])).toBeCloseTo(Math.sqrt(5));
  });
});