import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { Grid } from "lib/grid";
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map((e) => e.split("")).map((e) => e.num()) };
};

export const solve = (input: Input): number => {
  const grid = new Grid(input.values);

  let count = 0;

  grid.forEachByColumn((x, y, v) => {
    const [up, down] = grid.column(x).splitAt(y);
    const [left, right] = grid.row(y).splitAt(x);
    const fn = (k: number) => k < v;
    if (up.every(fn) || down.every(fn) || left.every(fn) || right.every(fn)) {
      count++;
    }
  })

  return count;
};

console.log(
  solve(
    parse(
      `30373
25512
65332
33549
35390`.split("\n")
    )
  )
);

console.log(solve(parse(readFile(__dirname))));
