import Watched from "./watched"

test('Watched int', () => {
  let val = 2
  const w = new Watched<number>(() => val)
  expect(w.getIfUpdated()).toBe(2)
  expect(w.getIfUpdated()).toBe(null)
  val = 3
  expect(w.getIfUpdated()).toBe(3)
})