import { lerp } from "./math"
import RollingAverage from "./RollingAverage"

/** WARNING: This is a hack. timeDelta_perfToAudio won't work for multiple contexts */
let avgTimeDelta: RollingAverage | null = null

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

/** DOMHighResTimesStamp from performance.now() 
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp 
 * 
 * Considered the source of truth for the user's perceived time.
 * 
 * When a source has latency
 * (e.g. keyboard input latency, audio output latency, video rendering latency) 
 * do our best to account for that latency when creating a PerfTime.
 * */
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

  /** According to AI, Input latency can vary widely 
   * (~5-15 ms for wired devices, ~20-30 ms for wireless devices) 
   * This function allows you to manually account for that latency */
  static fromEvent(event: Event, latency_ms: number = 5): PerfTime {
    return new PerfTime(Duration.ms(event.timeStamp - latency_ms))
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
    return new AudioTime(this.duration.minus(timeDelta_perfToAudio(ctx)))
  }

  approxEquals(other: PerfTime, epsilon: number = 0.001): boolean {
    return Math.abs(this.duration.s() - other.duration.s()) < epsilon
  }
}

/** Web Audio Context currentTime property
 * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/currentTime
 * 
 * Note that the user will hear the sound after some amount of latency
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
    return new PerfTime(this.duration.plus(timeDelta_perfToAudio(ctx)))
  }
}

export function timeDelta_perfToAudio(ctx: AudioContext): Duration {
  const perfNow = PerfTime.now().duration
  const audioNow = AudioTime.now(ctx).duration
  const delta = perfNow.minus(audioNow)
  if (avgTimeDelta) {
    avgTimeDelta.push(delta.s())
  } else {
    avgTimeDelta = new RollingAverage(delta.s(), 0.01)
  }
  return Duration.s(avgTimeDelta.get()).plus(audioLatency(ctx))
}

/** The latency between the audio context currentTime and when the user hears the sound */
function audioLatency(ctx: AudioContext): Duration {
  return Duration.s(ctx.baseLatency + ctx.outputLatency)
}
