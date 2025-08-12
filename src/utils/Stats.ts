export namespace Stats {
  export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  export function variance(values: number[]): number {
    if (values.length === 0) return 0;
    const meanValue = mean(values);
    return values.reduce((sum, value) => sum + Math.pow(value - meanValue, 2), 0) / values.length;
  }

  export function stdDev(values: number[]): number {
    if (values.length === 0) return 0;

    return Math.sqrt(variance(values));
  }
}

