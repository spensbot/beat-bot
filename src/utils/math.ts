export interface Range {
  start: number
  end: number
}

export function rangeLength(range: Range): number {
  return range.end - range.start
}

export function lerp(range: Range, ratio: number): number {
  return range.start + rangeLength(range) * ratio
}

export function unlerp(range: Range, value: number): number {
  return (value - range.start) / rangeLength(range)
}

export function rangeFromPointLength(point: number, length: number, ratio: number): Range {
  const start = point - ratio * length

  return {
    start,
    end: start + length
  }
}