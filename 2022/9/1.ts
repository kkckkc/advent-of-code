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
  let head = [0, 0];
  let tail = [0, 0];

  const visited: Record<string, boolean> = {};
  visited[`${tail}`] = true

  for (const move of input.values) {
    for (let i = 0; i < move.count; i++) {
      head[0] += MOVE[move.direction][0];
      head[1] += MOVE[move.direction][1];

      const headAdj = adjacent(head, ADJACENT);
      const overlap = overlaps([...headAdj, head], [tail]);
      if (! overlap) {
        const headOrtoAdj = adjacent(head, ORTO_ADJACENT);
        const tailOrtoAdj = adjacent(tail, ADJACENT);
        const newTail = overlaps(headOrtoAdj, tailOrtoAdj);
        tail = newTail; 
        visited[`${tail}`] = true
      }
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
  
console.log(solve(parse(readFile(__dirname))));
