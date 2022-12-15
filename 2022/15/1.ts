import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
applyPatches();

type Input = {
  values: number[][][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(l => l.split(/[^-0-9]/).filter(a => a !== '').num()).map(e => [[e[0], e[1]], [e[2], e[3]]]) };
};

export const solve = (input: Input, target: number): number => {
  const distances = input.values.map(([b, s]) => Math.abs(b[0] - s[0]) + Math.abs(b[1] - s[1]))

  const inTarget = new Set<number>();
  for (let i = 0; i < input.values.length; i++) {
    const [s] = input.values[i];
    const rd = distances[i] - Math.abs(s[1] - target);

    if (rd > 0) {
      const r = range(s[0] - rd, s[0] + rd);
      r.forEach((x) => inTarget.add(x));
    }
  }

  input.values.filter(e => e[1][1] === target).forEach(e => inTarget.delete(e[1][0]))

  return inTarget.size;
};

console.log(solve(parse(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`.split('\n')), 10));

console.log(solve(parse(readFile(__dirname)), 2000000));
