export default class RollingAverage {
  private average: number
  private newWeight = 1
  private oldWeight = 0
  private maxDelta: number | undefined

  constructor(init: number, newWeight: number = 0.1, maxDelta?: number) {
    if (newWeight < 0.0 || newWeight > 1.0) {
      throw new Error(`Invalid newWeight: ${newWeight}. It must be between 0.0 and 1.0.`)
    }
    this.average = init
    this.newWeight = newWeight
    this.oldWeight = 1.0 - newWeight
    this.maxDelta = maxDelta
  }

  push(sample: number) {
    this.average = this.newWeight * sample + this.oldWeight * this.average

    if (this.maxDelta) {
      this.resetIfOutsideDelta(sample, this.maxDelta)
    }
  }

  get() {
    return this.average
  }

  reset(newAverage: number) {
    this.average = newAverage
  }

  /** Resets the average if the rolling average is too far from the target average */
  resetIfOutsideDelta(newAverage: number, deltaThreshold: number) {
    const distance = Math.abs(newAverage - this.average)

    if (distance > deltaThreshold) {
      this.reset(newAverage)
    }
  }
}
