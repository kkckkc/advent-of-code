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
  return input.values.filter((r) => r[0].covers(r[1]) || r[1].covers(r[0]))
    .length;
};

console.log(solve(parse(readFile(__dirname))));
