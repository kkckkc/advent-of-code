import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[][];
};

const SCORE = {
  'X': 1,
  'Y': 2, 
  'Z': 3
}

const WIN = {
  'A': {
    'Z': 0,
    'X': 3,
    'Y': 6
  },
  'B': {
    'X': 0,
    'Y': 3,
    'Z': 6
  },
  'C': {
    'Y': 0,
    'Z': 3,
    'X': 6
  }
}

export const parse = (input: string[]): Input => {
  return { values: input.map(s => s.split(" ")) };
};

export const solve = (input: Input): number => {
  let score = 0;
  for (const [theirs, ours] of input.values) {
    const result = WIN[theirs][ours];
    score += result + SCORE[ours];
  }
  return score;
};

/*console.log(solve(parse(`A Y
B X
C Z`.split('\n'))));*/

console.log(solve(parse(readFile(__dirname))));
