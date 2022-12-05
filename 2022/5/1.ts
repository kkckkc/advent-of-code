import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { fill } from 'lib/arrays';
applyPatches();

type Move = { count: number, from: number, to: number };

type Input = {
  stacks: string[][];
  moves: Move[];
};

export const parse = (input: string[]): Input => {
  const stacks: string[][] = fill(9, () => []);
  const moves: Move[] = [];

  for (const l of input) {
    if (l.includes('[')) {
      l.split('').filter((_, i) => i % 4 === 1)
        .forEach((c, i) => c !== " " && stacks[i].unshift(c));
    } else if (l.startsWith("move")) {
      const [,count,,from,,to] = l.split(" ").num();
      moves.push({ count, from, to })
    }
  }

  return { stacks, moves };
};

export const solve = (input: Input): string => {
  let s = '';

  for (const move of input.moves) {
    for (let i = 0; i < move.count; i++) 
      input.stacks[move.to - 1].push(input.stacks[move.from - 1].pop())
  }

  return input.stacks.map(e => e.at(-1)).join('');
};

console.log(solve(parse(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
