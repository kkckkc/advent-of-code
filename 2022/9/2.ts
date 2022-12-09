import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
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
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
  D: [0, 1]
}

const ADJACENT = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const ORTO_ADJACENT = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1]
];

export const parse = (input: string[]): Input => {
  return { values: input.map(l => {
    const [d, c] = l.split(" ");
    return { direction: d, count: Number(c) }
  }) };
};

const adjacent = (pos: number[], adj: number[][]) => {
  return adj.map(d => [pos[0] + d[0], pos[1] + d[1]]);
}

const overlaps = (a: number[][], b: number[][]) => {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i][0]  == b[j][0] && a[i][1] === b[j][1]) {
        return a[i];
      }   
    }
  }
  return undefined;
}

export const solve = (input: Input): number => {
  let segments = range(0, 9).map(() => [0, 0]);

  const visited: Record<string, boolean> = {};
  visited[`${segments.at(-1)}`] = true

  for (const move of input.values) {
    for (let i = 0; i < move.count; i++) {
      segments[0][0] += MOVE[move.direction][0];
      segments[0][1] += MOVE[move.direction][1];

      for (let s = 1; s < segments.length; s++) {
        const head = segments[s - 1];
        const tail = segments[s];

        const headAdj = adjacent(head, ADJACENT);
        const overlap = overlaps([...headAdj, head], [tail]);
        if (! overlap) {
          const headOrtoAdj = adjacent(head, ORTO_ADJACENT);
          const tailOrtoAdj = adjacent(tail, ADJACENT);
          const newTail = overlaps(headOrtoAdj, tailOrtoAdj) ?? overlaps(adjacent(head, ADJACENT), tailOrtoAdj);
          segments[s] = newTail; 
        }
      }

      visited[`${segments.at(-1)}`] = true
    }
  }

  return Object.keys(visited).length;
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
