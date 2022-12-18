import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(e => e.split(',').num() ) };
};

const ADJACENT = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1]
]

export const solve = (input: Input): number => {
  const s = new Set<string>();
  input.values.forEach(e => s.add(e.join(',')));

  let sides = 0;
  for (const e of input.values) {
    sides += ADJACENT.filter(a => !s.has([a[0] + e[0], a[1] + e[1], a[2] + e[2]].join(','))).length;
  }

  return sides;
};

console.log(solve(parse(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
