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

const printBoard = (H: number, W: number, R: number, C: number, storms: MultiMap<string, string>) => {
  for (const r of range(0, H - 1)) {
    let l: string[] = [];
    for (const c of range(0, W - 1)) {
      if (storms.has([r, c].key())) {
        let arr = storms.get([r, c].key());
        if (arr.length === 1) l.push(arr[0]);
        else l.push(arr.length.toString());
      } else if (r === R && c === C) {
        l.push('E');
      } else {
        l.push('.');
      }
    }
    console.log(l.join(''))
  }

  console.log();
}

const getStormsForMinute = (W: number, H: number, min: number, stormsPerMinute: Record<number, MultiMap<string, string>>) => {
  if (min in stormsPerMinute) return stormsPerMinute[min];

  // Move storms
  let newStorms = new MultiMap<string, string>();
  for (const [k, arr] of Object.entries(stormsPerMinute[min - 1].map)) {
    for (const v of arr) {
      if (v === '<') {
        const newPos = k.split(',').num().add([0, -1]);
        if (newPos[1] < 0) newPos[1] = W - 1;
        newStorms.add(newPos.key(), '<');
      }
      else if (v === '>') {
        const newPos = k.split(',').num().add([0, 1]);
        if (newPos[1] >= W) newPos[1] = 0;
        newStorms.add(newPos.key(), '>');
      } 
      else if (v === '^') {
        const newPos = k.split(',').num().add([-1, 0]);
        if (newPos[0] < 0) newPos[0] = H - 1;
        newStorms.add(newPos.key(), '^');
      }
      else if (v === 'v') {
        const newPos = k.split(',').num().add([1, 0]);
        if (newPos[0] >= H) newPos[0] = 0;
        newStorms.add(newPos.key(), 'v');
      }
    }
  }
  stormsPerMinute[min] = newStorms;
  return stormsPerMinute[min];
}

export const solve = (input: Input): number => {
  let storms = new MultiMap<string, string>();
  for (let r = 0; r < input.values.length; r++) {
    for (let c = 0; c < input.values[r].length; c++) {
      if (input.values[r][c] !== '.') {
        storms.add([r, c].key(), input.values[r][c])
      }
    }
  }

  let stormsPerMinute = { 0: storms };

  let q: number[][] = [[1, 0, 0]];

  const H = input.values.length;
  const W = input.values[0].length;

  const best: Record<string, number> = {};

  const queued = new Set<string>();

  while (q.length > 0) {
    let [min, r, c, waited] = q.pop();

//    console.log(waited);
/*    if (best[[r, c].key()]) {
      continue;
    }*/

    getStormsForMinute(W, H, min, stormsPerMinute);
//    console.log(`Minute ${min}`);
//    printBoard(H, W, r, c, getStormsForMinute(W, H, min, stormsPerMinute));

    best[[r, c].key()] = min;

    if (r === H - 1 && c === W - 1) return min + 1;

    
    const nextStorms = getStormsForMinute(W, H, min + 1, stormsPerMinute);
    for (const dir of directions) {
      let newPos = [r, c].add(dir);
      if (newPos[0] < 0 || newPos[1] < 0 || newPos[1] >= W || newPos[0] >= H) {
        continue;
      }
      if (! nextStorms.has(newPos.key())) {
        const newElement = [min + 1, ...newPos];
        if (! queued.has(newElement.key())) {
          q.unshift(newElement);
          queued.add(newElement.key())
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
