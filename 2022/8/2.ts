import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { column, row } from 'lib/arrays';
import { Grid } from 'lib/grid';
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(e => e.split("")).map(e => e.num() ) };
};

export const solve = (input: Input): number => {
  const grid = new Grid(input.values);
  
  const S = (arr: number[], v: number) => {
    const idx = arr.findIndex(c => c >= v);
    return idx === -1 ? arr.length : idx + 1;
  }

  let maxScore = 0;
  grid.forEachByColumn((x, y, c) => {
    const [up, down] = grid.column(x).splitAt(y);
    const [left, right] = grid.row(y).splitAt(x);
    maxScore = Math.max(maxScore, S(left.reverse(), c) * S(right, c) * S(up.reverse(), c) * S(down, c));
  })

  return maxScore;
};

console.log(solve(parse(`30373
25512
65332
33549
35390`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
