import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Move = {
  direction: string;
  count: number;
}

type Input = {
  values: Move[];
};

const MOVE = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
  D: [0, 1]
}

export const parse = (input: string[]): Input => {
  return { values: input.map(l => {
    const [d, c] = l.split(" ");
    return { direction: d, count: Number(c) }
  }) };
};

export const solve = (input: Input): number => {
  let head = [0, 0];
  let tail = [0, 0];

  const visited = new Set<string>([`${tail}`]);

  for (const move of input.values) {
    for (let i = 0; i < move.count; i++) {
      const oldHead = head;
      head = [head[0] + MOVE[move.direction][0], head[1] + MOVE[move.direction][1]];

      if (Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1) {
        tail = oldHead;
      }
      visited.add(`${tail}`);
    }
  }

  return visited.size;
};

console.log(solve(parse(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`.split('\n'))));
  
console.log(solve(parse(readFile(__dirname))));
