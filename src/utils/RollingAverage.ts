export default class RollingAverage {
  private average: number
  private newWeight = 1
  private oldWeight = 0

  constructor(init: number, newWeight: number = 0.1) {
    if (newWeight < 0.0 || newWeight > 1.0) {
      throw new Error(`Invalid newWeight: ${newWeight}. It must be between 0.0 and 1.0.`)
    }
    this.average = init
    this.newWeight = newWeight
    this.oldWeight = 1.0 - newWeight
  }

  push(sample: number) {
    this.average = this.newWeight * sample + this.oldWeight * this.average
  }

  get() {
    return this.average
  }

  reset(newAverage: number) {
    this.average = newAverage
  }
}
