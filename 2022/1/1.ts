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
  return input.values.map((e) => e.sum()).max();
};

console.log(solve(parse(readFile(__dirname))));
