export const fixedPoint = <T>(d: T, fn: ((d: T)=> T)): T => {
  const n = fn(d);
  if (n === d) return d;
  return fixedPoint(n, fn);
}

