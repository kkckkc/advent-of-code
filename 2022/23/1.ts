import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
import { MultiMap } from 'lib/bag';
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  let dest: number[][] = [];
  for (let r = 0; r < input.length; r++) {
    for (let i = 0; i < input[r].length; i++) {
      if (input[r].charAt(i) === '#') {
        dest.push([r, i]);
      }
    }
  }

  return { values: dest };
};

let directions = ['N', 'S', 'W', 'E']

let positions = {
  'N': [[-1, -1], [-1, 0], [-1, 1]],
  'S': [[1, -1], [1, 0], [1, 1]],
  'W': [[-1, -1], [0, -1], [1, -1]],
  'E': [[-1, 1], [0, 1], [1, 1]]
}

let all = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
]



export const solve = (input: Input): number => {
  let current = input.values;

  let direction = 0;
  let len = current.length;

  for (let round = 0; round < 10; round++) {
    const proposed = new MultiMap<string, number>;
    const curSet = new Set(current.map(c => c.key())); 

    for (let e = 0; e < current.length; e++) {
      const cur = current[e];

      let found = false;

      if (all.some(p => curSet.has(cur.add(p).key()))) {
        for (let d = 0; d < 4 && !found; d++) {
          const dir = directions[(direction + d) % 4];
          if (positions[dir].every(p => !curSet.has(p.add(cur).key()))) {
            proposed.add(cur.add(positions[dir][1]).key(), e);
            found = true;
          }
        }
      }

      if (! found) {
        proposed.add(cur.key(), e);
      }
    }

    const newCurrent: number[][] = [];
    for (const [p, arr] of Object.entries(proposed.map)) {
      if (arr.length === 1) {
        newCurrent.push(p.split(',').num())
      } else {
        arr.forEach(a => newCurrent.push(current[a]));
      }
    }
    current = newCurrent;
    direction++;
  }

  const width = current.map(c => c[1]).max() - current.map(c => c[1]).min();
  const height = current.map(c => c[0]).max() - current.map(c => c[0]).min();

  return (width + 1) * (height + 1) - len;
};

console.log(solve(parse(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
