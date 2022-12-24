import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { MultiMap } from 'lib/bag';
import { range } from 'lib/arrays';
applyPatches();

type Input = {
  values: string[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.slice(1, -1).map(e => e.split('').slice(1, -1)) };
};

let directions = [[-1, 0], [0, -1], [0, 1], [1, 0], [0, 0]];
const movements = {
  '>': [0, 1],
  '<': [0, -1],
  'v': [1, 0],
  '^': [-1, 0]
}

const getStormsForMinute = (W: number, H: number, min: number, stormsPerMinute: Record<number, MultiMap<string, string>>) => {
  if (min in stormsPerMinute) return stormsPerMinute[min];

  const newStorms = new MultiMap<string, string>();
  for (const [k, arr] of Object.entries(stormsPerMinute[min - 1].map)) {
    const karr = k.split(',').num();
    for (const v of arr) {
      const newPos = karr.add(movements[v]);
      if (newPos[1] < 0) newPos[1] = W - 1;
      if (newPos[1] >= W) newPos[1] = 0;
      if (newPos[0] < 0) newPos[0] = H - 1;
      if (newPos[0] >= H) newPos[0] = 0;
      newStorms.add(newPos.key(), v);
    }
  }
  stormsPerMinute[min] = newStorms;
  return newStorms;
}

export const solve = (input: Input): number => {
  const H = input.values.length;
  const W = input.values[0].length;

  let storms = new MultiMap<string, string>();
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (input.values[r][c] !== '.') {
        storms.add([r, c].key(), input.values[r][c])
      }
    }
  }

  const stormsPerMinute = { 0: storms };

  let q: number[][] = [[0, -1, 0]];

  const targets = [[H, W - 1], [-1, 0], [H, W - 1]];
targetLoop:
  for (let idx = 0; idx < targets.length; idx++) {
    const target = targets[idx];
    const queued = new Set<string>();
    while (q.length > 0) {
      const [min, r, c] = q.pop();

      if (r === target[0] && c === target[1]) {
        console.log('--', min);
        if (idx === targets.length - 1) return min;
        q = [[min, ...target]]
        continue targetLoop;
      }
      
      const nextStorms = getStormsForMinute(W, H, min + 1, stormsPerMinute);
      for (const dir of directions) {
        let newPos = [r, c].add(dir);
        let outOfBounds = newPos[0] < 0 || newPos[1] < 0 || newPos[1] >= W || newPos[0] >= H;

        if (newPos[0] === -1 && newPos[1] === 0) outOfBounds = false;
        if (newPos[0] === H && newPos[1] === W - 1) outOfBounds = false;

        if (outOfBounds) continue;

        if (! nextStorms.has(newPos.key())) {
          const newElement = [min + 1, ...newPos];
          if (! queued.has(newElement.key())) {
            q.unshift(newElement);
            queued.add(newElement.key())
          }
        }
      }
    }
  }

  return -1;
};

console.log(solve(parse(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`.split('\n'))));



console.log(solve(parse(readFile(__dirname))));
