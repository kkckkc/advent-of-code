import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { V2 } from 'lib/vectors';
import { range } from 'lib/arrays';
applyPatches();

type Move = {
  direction: string;
  count: number;
}

type Input = {
  values: Move[];
};

const MOVE = {
  L: V2.of(-1, 0),
  R: V2.of(1, 0),
  U: V2.of(0, -1),
  D: V2.of(0, 1)
}

export const parse = (input: string[]): Input => {
  return { values: input.map(l => {
    const [d, c] = l.split(" ");
    return { direction: d, count: Number(c) }
  }) };
};

let LENGTH = 2;

export const solve = (input: Input): number => {
  const seg = range(1, LENGTH).map(() => V2.of(0, 0));
  const visited = new Set<string>([`${seg.at(-1)}`]);

  for (const move of input.values) {
    for (let i = 0; i < move.count; i++) {
      const old = seg.map(e => e.clone());
      seg[0] = seg[0].add(MOVE[move.direction]);

      for (let s = 1; s < seg.length; s++) {
        if (seg[s - 1].sub(seg[s]).v.some(k => Math.abs(k) > 1)) 
          seg[s] = old[s - 1];
      }

      visited.add(`${seg.at(-1)}`);
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
  
console.log(solve(parse(`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
