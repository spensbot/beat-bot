export function deleteElement<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    throw new Error('Index out of range');
  }
  return array.slice(0, index).concat(array.slice(index + 1));
}

export function indexArray(length: number): number[] {
  return Array.from(Array(length).keys())
}

export function sum<T>(list: T[], get: (item: T) => number): number {
  return list.reduce((acc, item) => acc + get(item), 0)
}