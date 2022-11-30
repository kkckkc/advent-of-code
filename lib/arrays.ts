export const range = (start: number, end: number) => {
  const d = [];
  for (let i = start; i <= end; i++) {
    d.push(i);
  }
  return d;
}

export const fill = <T>(count: number, what: T): T[] => {
  const d: T[] = [];
  for (let i = 0; i < count; i++) {
    d.push(what);
  }
  return d;
}

export const split = <T>(arr: T[], len: number): T[][] => {
  return range(0, (arr.length / len) - 1).map(l => arr.slice(len * l, len * (l + 1)));
}