import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Point = {
  x: number;
  y: number;
}

type Input = {
  values: Point[][];
};

export const parse = (input: string[]): Input => {
  return {
    values: input
      .map((l) => l.split(/[^-0-9]/).filter((a) => a !== "").num() )
      .map((e) => [ { x: e[0], y: e[1] }, { x: e[2], y: e[3] } ]),
  };
};

const distance = (p1: Point, p2: Point) =>
  Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

export const solve = (input: Input, target: number): number => {
  const distances = input.values.map(([b, s]) => distance(b, s));

  const solveSubset = (
    xs: number,
    xe: number,
    ys: number,
    ye: number
  ): number | undefined => {
    const corners = [
      { x: xs, y: ys }, { x: xe, y: ys },
      { x: xs, y: ye }, { x: xe, y: ye },
    ];
    const allCovered = input.values.some((p1, idx) =>
      corners.every((p2) => distance(p1[0], p2) <= distances[idx])
    );
    if (allCovered) return undefined;

    if (xs === xe && ys === ye) {
      return 4000000 * xs + ys;
    }

    const mx = xs + Math.floor((xe - xs) / 2);
    const my = ys + Math.floor((ye - ys) / 2);
    const subdivisions = [
      [xs, mx, ys,     my], [mx + 1, xe, ys,     my],
      [xs, mx, my + 1, ye], [mx + 1, xe, my + 1, ye],
    ].filter(([x1, x2, y1, y2]) => x1 <= x2 && y1 <= y2);

    return subdivisions
      .map(([x1, x2, y1, y2]) => solveSubset(x1, x2, y1, y2))
      .find((a) => a !== undefined);
  };

  return solveSubset(0, target, 0, target);
};

console.log(
  solve(
    parse(
      `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
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
Sensor at x=20, y=1: closest beacon is at x=15, y=3`.split("\n")
    ),
    20
  )
);

console.log(solve(parse(readFile(__dirname)), 4000000));
