export default class Watched<T> {
  private val: T | undefined = undefined
  private getter: () => T

  constructor(getter: () => T) {
    this.getter = getter
  }

  getIfUpdated(): T | null {
    const val = this.getter()
    if (val != this.val) {
      this.val = val
      return this.val
    } else {
      return null
    }
  }

  ifUpdated(f: (val: T) => void) {
    const updatedVal = this.getIfUpdated()
    if (updatedVal !== null) {
      f(updatedVal)
    }
  }
}