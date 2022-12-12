import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(l => l.split('')) };
};

const adjacent = (r: number, c: number, grid: string[][]) => {
  const curCode = grid[r][c].charCodeAt(0);
  return [[-1, 0], [1, 0], [0, -1], [0, 1]]
    .map(([or, oc]) => [Number(r) + or, Number(c) + oc])
    .filter(([or, oc]) => oc >= 0 && or >= 0 && oc < grid[0].length && or < grid.length)
    .filter(([or, oc]) => {
      return (curCode <= grid[or][oc].charCodeAt(0)) || curCode - grid[or][oc].charCodeAt(0) <= 1;
    });
}

const toS = (arr: number[] | string[]) => arr.join(',');

export const solve = (input: Input): number => {
  const grid = input.values;
  const distance = grid.map(r => r.map(() => Number.MAX_SAFE_INTEGER-1));

  const S = [grid.findIndex(r => r.includes('S')), grid.find(r => r.includes('S')).findIndex(c => c === 'S')];
  const E = [grid.findIndex(r => r.includes('E')), grid.find(r => r.includes('E')).findIndex(c => c === 'E')];

  grid[S[0]][S[1]] = 'a';
  grid[E[0]][E[1]] = 'z';

  const current = new Set<string>();
  current.add(toS(E));

  distance[E[0]][E[1]] = 0;

  while (current.size > 0) {
    let u = undefined;
    let s = Number.MAX_SAFE_INTEGER;
    for (const uC of current.values()) {
      let [r, c] = uC.split(',').num();
      if (distance[r][c] <= s) {
        u = [r, c];
        s = distance[r][c];
      }
    } 

    current.delete(toS(u));

    const alt = distance[u[0]][u[1]] + 1;
    for (const n of adjacent(u[0], u[1], grid)) {
      if (alt < distance[n[0]][n[1]]) {
        distance[n[0]][n[1]] = alt;
        current.add(toS(n));
      }
    }
  }
  const distances = grid.flatMap((r, rIdx) => r
    .map((_, cIdx) => grid[rIdx][cIdx] === 'a' ? distance[rIdx][cIdx] : Number.MAX_SAFE_INTEGER))
  return distances.min();
};

console.log(solve(parse(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
function findSmallest() {
  throw new Error('Function not implemented.');
}

