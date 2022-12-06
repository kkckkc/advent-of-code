import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[];
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('') };
};

const n = 14;

export const solve = (input: Input): number => {
  for (let i = n; i < input.values.length; i++) {
    const dict: Record<string, boolean> = {};
    for (let j = 0; j < n; j++) {
      dict[input.values[i - j]] = true
      if (Object.keys(dict).length === n) return i + 1;
    }
  }
  return -1;
};

console.log(solve(parse(readFile(__dirname))));
