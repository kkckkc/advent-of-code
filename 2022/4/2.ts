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
  return {
    from: Number(s.split("-")[0]),
    to: Number(s.split("-")[1]),
  };
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
  return (
    (r2.from >= r1.from && r2.from <= r1.to) ||
    (r2.to >= r1.from && r2.to <= r1.to)
  );
};

export const solve = (input: Input): number => {
  return input.values.filter((r) => covers(r[0], r[1]) || covers(r[1], r[0]))
    .length;
};

console.log(solve(parse(readFile(__dirname))));
