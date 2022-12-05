import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Move = { count: number, from: number, to: number };

type Input = {
  stacks: string[][];
  moves: Move[];
};

export const parse = (input: string[]): Input => {
  let stacks: string[][] = [[], [], [], [], [], [], [], [], [], []];
  const moves: Move[] = [];
  for (const l of input) {
    if (l.startsWith('[') || l === input[0]) {
      for (let i = 0; i < 9; i++) {
        const v = l.charAt(i*4+1);
        if (v === " ") continue;
        stacks[i].push(v);
      }
    } else if (l.startsWith("move")) {
      const [,m,,f,,t] = l.split(" ");
      moves.push({ count: Number(m), from: Number(f), to: Number(t) })
    }
  }

  for (let i = 0; i < stacks.length; i++) {
    stacks[i] = stacks[i].reverse()
  }

  return { stacks, moves };
};

export const solve = (input: Input): string => {
  let s = '';

  s = '';
  for (let i = 0; i < 9; i++) {
    s += input.stacks[i].at(-1);
  }
  console.log(s);

  for (const move of input.moves) {
    for (let i = 0; i < move.count; i++) 
    input.stacks[move.to - 1].push(input.stacks[move.from - 1].pop())

    s = '';
    for (let i = 0; i < 9; i++) {
      s += input.stacks[i].at(-1) ?? ' ';
    }
    console.log(s);
  }

  s = '';
  for (let i = 0; i < 9; i++) {
    s += input.stacks[i].at(-1) ?? ' ';
  }
  return s;
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
