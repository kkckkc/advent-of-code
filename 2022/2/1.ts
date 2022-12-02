import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[];
};

const SCORE = {
  "A X": 1 + 3,
  "A Y": 2 + 6,
  "A Z": 3 + 0,
  "B X": 1 + 0,
  "B Y": 2 + 3,
  "B Z": 3 + 6,
  "C X": 1 + 6,
  "C Y": 2 + 0,
  "C Z": 3 + 3,
}

export const parse = (input: string[]): Input => {
  return { values: input };
};

export const solve = (input: Input): number => {
  return input.values.map(a => SCORE[a]).sum();
};

console.log(solve(parse(readFile(__dirname))));
