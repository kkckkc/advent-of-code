export const range = (start: number, end: number) => {
  const d = [];
  if (start > end) {
    for (let i = start; i >= end; i--) {
      d.push(i);
    }
  } else {
    for (let i = start; i <= end; i++) {
      d.push(i);
    }
  }
  return d;
}

export const fill = <T>(count: number, what: T | (() => T)): T[] => {
  const d: T[] = [];
  for (let i = 0; i < count; i++) {
    if (typeof what === 'function') {
      d.push((what as any)());
    } else {
      d.push(what);
    }
  }
  return d;
}

export const split = <T>(arr: T[], len: number): T[][] => {
  return range(0, (arr.length / len) - 1).map(l => arr.slice(len * l, len * (l + 1)));
}

export const sum = (arr: number[]) => arr.reduce((c, a) => c + a, 0);

export const column = <T>(arr: T[][], col: number): T[] => {
  return range(0, arr.length - 1).map(r => arr[r][col]);
}

export const row = <T>(arr: T[][], row: number): T[] => arr[row];