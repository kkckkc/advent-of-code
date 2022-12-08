import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from "lib/arrays";
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map((e) => e.split("")).map((e) => e.num()) };
};

export const solve = (input: Input): number => {
  const w = input.values[0].length;
  const h = input.values.length;

  let count = 0;
  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      const beforeRow = range(0, x - 1).map((x2) => input.values[y][x2]);
      const afterRow = range(x + 1, w - 1).map((x2) => input.values[y][x2]);
      const beforeCol = range(0, y - 1).map((y2) => input.values[y2][x]);
      const afterCol = range(y + 1, h - 1).map((y2) => input.values[y2][x]);

      const c = input.values[y][x];
      if (
        beforeRow.every((v) => v < c) ||
        afterRow.every((v) => v < c) ||
        beforeCol.every((v) => v < c) ||
        afterCol.every((v) => v < c)
      ) {
        count++;
      }
    }
  }

  return 2 * w + 2 * h - 4 + count;
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
