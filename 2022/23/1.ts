import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
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


const printBoard = (round: number, current: number[][]) => {
  console.log(`== End of Round ${round + 1} ==`)

  let minRow = current.map(c => c[0]).min();
  let maxRow = current.map(c => c[0]).max();
  let minCol = current.map(c => c[1]).min();
  let maxCol = current.map(c => c[1]).max();

  let cur = new Set(current.map(c => c.join(',')))

  for (let r of range(minRow, maxRow)) {
    let l: string[] = [];
    for (let c of range(minCol, maxCol)) {
      if (cur.has([r, c].key())) {
        l.push('#')
      } else {
        l.push('.')
      }
    }
    console.log(l.join(''))
  }
  console.log();
}

export const solve = (input: Input): number => {
  let current = input.values;

  let direction = 0;
  let len = current.length;

//  printBoard(-1, current);

  for (let round = 0; round < 10; round++) {
    let proposed: Record<string, number[]> = {};
    let cur = new Set(current.map(c => c.join(',')))

    for (let e = 0; e < current.length; e++) {
      let found = false;

      if (all.some(p => cur.has(current[e].add(p).key()))) {
        for (let d = 0; d < 4; d++) {
          let dir = directions[(direction + d) % 4];
          if (positions[dir].every(p => !cur.has(p.add(current[e]).key()))) {
            const prop = current[e].add(positions[dir][1]);
            proposed[prop.key()] = proposed[prop.key()] ?? [];
            proposed[prop.key()].push(e);
            found = true;
            break;
          }
        }
      }

      if (! found) {
        const prop = current[e];
        proposed[prop.key()] = proposed[prop.key()] ?? [];
        proposed[prop.key()].push(e);
      }
    }

    let newCurrent: number[][] = [];
    for (const [p, arr] of Object.entries(proposed)) {
      if (arr.length === 1) {
        newCurrent.push(p.split(',').num())
      } else {
        arr.forEach(a => newCurrent.push(current[a]));
      }
    }
    current = newCurrent;

//    printBoard(round, current);
    direction++;
  }

  const width = current.map(c => c[1]).max() - current.map(c => c[1]).min();
  const height = current.map(c => c[0]).max() - current.map(c => c[0]).min();

  return (width + 1) * (height + 1) - len;
};

console.log(solve(parse(`....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
