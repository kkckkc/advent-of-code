export const binarySearch = (lower: number, upper: number, target: number, fn: ((c: number) => number)) => {
  if (fn(lower) > target) throw new Error('lower bound to big');
  if (fn(upper) < target) throw new Error('upper bound to small');

  const inner = (l: number, u: number): number => {
    const midPoint = Math.floor(l + (u - l) / 2);
    if (l === u || l === midPoint) {
      if (fn(l) === target) return l;
      if (fn(u) === target) return u;
      return -l;
    }

    if (fn(midPoint) < target) {
      return inner(midPoint, u);
    } else {
      return inner(l, midPoint);
    }
  }

  return inner(lower, upper);
}