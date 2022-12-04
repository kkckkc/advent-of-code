import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Range = {
  from: number;
  to: number;
};

type Input = {
  values: Range[][];
};

const makeRange = (s: string) => {
  const [from, to] = s.split('-').num();
  return { from, to };
};

export const parse = (input: string[]): Input => {
  return {
    values: input.map((l) => {
      const [a, b] = l.split(",");
      return [makeRange(a), makeRange(b)];
    }),
  };
};

const covers = (r1: Range, r2: Range) => {
  return r2.from >= r1.from && r2.to <= r1.to;
};

export const solve = (input: Input): number => {
  return input.values.filter((r) => covers(r[0], r[1]) || covers(r[1], r[0]))
    .length;
};

console.log(solve(parse(readFile(__dirname))));
