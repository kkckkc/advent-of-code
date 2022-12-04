import { readFile } from "lib/readFile";
import { Range } from 'lib/range';
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: Range[][];
};

export const parse = (input: string[]): Input => {
  return {
    values: input.map((l) => {
      const [a, b, c, d] = l.split(/,|-/).num();
      return [new Range(a, b), new Range(c, d)];
    }),
  };
};

export const solve = (input: Input): number => {
  return input.values
    .filter(([a, b]) => a.union(b).size() === Math.max(a.size(), b.size()))
    .length;
};

console.log(solve(parse(readFile(__dirname))));
