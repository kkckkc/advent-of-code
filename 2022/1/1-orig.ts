import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.splitOn(e => e === "").map(e => e.num() ) };
};

export const solve = (input: Input): number => {
  console.dir(input, { depth: 10 });
  return input.values.map((e) => e.sum()).max();
};

// console.log(solve(parse(``.split('\n'))));
console.log(solve(parse(readFile(__dirname))));
