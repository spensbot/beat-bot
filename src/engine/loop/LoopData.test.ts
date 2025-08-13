import { expect, test } from 'vitest'
import { concat, repeat } from './LoopData'

test('repeat()', () => {
  const one = repeat(1, 1)
  expect(one.beatLength).toBe(1)
  expect(one.notes.length).toBe(1)
  expect(one.notes[0].beatTime).toBe(0.0)

  const two = repeat(2, 1)
  expect(two.beatLength).toBe(1)
  expect(two.notes.length).toBe(2)
  expect(two.notes[0].beatTime).toBe(0.0)
  expect(two.notes[1].beatTime).toBe(0.5)
})

test('concat()', () => {
  const res = concat([repeat(1, 1), repeat(2, 1)])
  expect(res.beatLength).toBe(2)
  expect(res.notes.length).toBe(3)
  expect(res.notes[0].beatTime).toBe(0.0)
  expect(res.notes[1].beatTime).toBe(1.0)
  expect(res.notes[2].beatTime).toBe(1.5)
})