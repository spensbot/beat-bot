import { describe, expect, test } from 'vitest'
import { indexArray, sum } from './listUtils'

test('indexArray()', () => {
  const ia = indexArray(3)
  expect(ia[0]).toBe(0)
  expect(ia[1]).toBe(1)
  expect(ia[2]).toBe(2)
  expect(ia[3]).toBe(undefined)
})

test('sum()', () => {
  expect(sum([1, 2, 3, 4], (item) => item)).toBe(10)
})