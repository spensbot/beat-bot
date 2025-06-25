import { lerp } from "./math"

export class Duration {
  private seconds

  private constructor(seconds: number) {
    this.seconds = seconds
  }

  static s(seconds: number): Duration {
    return new Duration(seconds)
  }

  static ms(millis: number): Duration {
    return new Duration(millis / 1000)
  }

  static zero(): Duration {
    return new Duration(0)
  }

  s() {
    return this.seconds
  }

  ms() {
    return this.seconds * 1000
  }

  minus(other: Duration) {
    return new Duration(this.seconds - other.seconds)
  }

  plus(other: Duration) {
    return new Duration(this.seconds + other.seconds)
  }

  toString(): string {
    return `${this.s().toFixed(3)}s`
  }

  abs(): Duration {
    return Duration.s(Math.abs(this.s()))
  }
}

export class Tempo {
  period: Duration

  private constructor(period: Duration) {
    this.period = period
  }

  static bpm(bpm: number): Tempo {
    return new Tempo(Duration.s(60 / bpm))
  }

  bpm(): number {
    return 60 / this.period.s()
  }

  beatsToDuration(beats: number): Duration {
    return Duration.s(beats * this.period.s())
  }

  durationToBeats(duration: Duration): number {
    return duration.s() / this.period.s()
  }
}

// DOMHighResTimesStamp from performance.now()
// https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
export class PerfTime {
  duration: Duration

  constructor(duration: Duration) {
    this.duration = duration
  }

  static s(seconds: number): PerfTime {
    return new PerfTime(Duration.s(seconds))
  }

  static now(): PerfTime {
    return new PerfTime(Duration.ms(window.performance.now()))
  }

  // I havne't found docs to confirm. But many sources mention that the midi timestamp
  // is based on the same DOMHighResTimeStamp as window.performance.now()
  static fromEvent(event: Event): PerfTime {
    return new PerfTime(Duration.ms(event.timeStamp))
  }

  plus(duration: Duration): PerfTime {
    return new PerfTime(this.duration.plus(duration))
  }

  lessThan(other: PerfTime): boolean {
    return this.duration.s() < other.duration.s()
  }

  delta(other: PerfTime): Duration {
    return this.duration.minus(other.duration)
  }

  lerp(to: PerfTime, ratio: number): PerfTime {
    const s = lerp({ start: this.duration.s(), end: to.duration.s() }, ratio)
    return PerfTime.s(s)
  }

  isBetween(start: PerfTime, end: PerfTime): boolean {
    return this.duration.s() >= start.duration.s() && this.duration.s() <= end.duration.s()
  }

  toString(): string {
    return `${this.duration.s().toFixed(1)}s`
  }

  toAudioTime(ctx: AudioContext): AudioTime {
    const audioNow = AudioTime.now(ctx).duration
    const perfNow = PerfTime.now().duration
    const delta = audioNow.minus(perfNow)
    return new AudioTime(this.duration.plus(delta))
  }

  approxEquals(other: PerfTime, epsilon: number = 0.001): boolean {
    return Math.abs(this.duration.s() - other.duration.s()) < epsilon
  }
}

/** Web Audio Context currentTime property
https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/currentTime
*/
export class AudioTime {
  duration: Duration

  constructor(duration: Duration) {
    this.duration = duration
  }

  static zero(): AudioTime {
    return new AudioTime(Duration.s(0))
  }

  static now(ctx: AudioContext): AudioTime {
    return new AudioTime(Duration.s(ctx.currentTime))
  }

  plus(duration: Duration): AudioTime {
    return new AudioTime(this.duration.plus(duration))
  }

  toPerf(ctx: AudioContext): PerfTime {
    const perfNow = PerfTime.now().duration
    const audioNow = AudioTime.now(ctx).duration
    const delta = perfNow.minus(audioNow)
    return new PerfTime(this.duration.plus(delta))
  }
}