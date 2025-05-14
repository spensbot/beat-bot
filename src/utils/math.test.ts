import { rangeLength, Range, lerp, unlerp, rangeFromPointLength } from './math'

function r(start: number, end: number): Range {
  return {
    start,
    end
  }
}

test('rangeLength', () => {
  expect(rangeLength(r(0, 5))).toBe(5)
})

test('lerp', () => {
  expect(lerp(r(0, 100), -1)).toBe(-100)
  expect(lerp(r(0, 100), 0.0)).toBe(0)
  expect(lerp(r(0, 100), 0.5)).toBe(50)
  expect(lerp(r(0, 100), 2.0)).toBe(200)
})

test('unlerp', () => {
  expect(unlerp(r(0, 100), -100)).toBe(-1)
  expect(unlerp(r(0, 100), 0)).toBe(0)
  expect(unlerp(r(0, 100), 50)).toBe(0.5)
  expect(unlerp(r(0, 100), 200)).toBe(2.0)
})

test('rangeFromPointLength', () => {
  const range = rangeFromPointLength(25, 100, 0.25)
  expect(range.start).toBe(0)
  expect(range.end).toBe(100)
})