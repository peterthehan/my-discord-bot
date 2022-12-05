export function range(start: number, size: number): number[] {
  return [...Array(size).keys()].map((i) => i + start);
}
