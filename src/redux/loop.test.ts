import { concat, repeat } from './loop'

test('repeat()', () => {
  const one = repeat(1)
  expect(one.length).toBe(1)
  expect(one.hits.length).toBe(1)
  expect(one.hits[0].time).toBe(0.0)

  const two = repeat(2)
  expect(two.length).toBe(1)
  expect(two.hits.length).toBe(2)
  expect(two.hits[0].time).toBe(0.0)
  expect(two.hits[1].time).toBe(0.5)
})

test('concat()', () => {
  const res = concat([repeat(1), repeat(2)])
  expect(res.length).toBe(2)
  expect(res.hits.length).toBe(3)
  expect(res.hits[0].time).toBe(0.0)
  expect(res.hits[1].time).toBe(1.0)
  expect(res.hits[2].time).toBe(1.5)
})