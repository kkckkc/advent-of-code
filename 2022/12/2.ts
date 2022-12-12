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
    .map(([or, oc]) => [r + or, c + oc])
    .filter(([or, oc]) => grid[or]?.[oc]?.charCodeAt(0) - curCode <= 1)
}

const toS = (arr: number[] | string[]) => Number(arr[0]) * 1000 + Number(arr[1]);

export const solve = (input: Input): number => {
  const grid = input.values;

  let S = [grid.findIndex(r => r.includes('S')), grid.find(r => r.includes('S')).findIndex(c => c === 'S')];
  const E = [grid.findIndex(r => r.includes('E')), grid.find(r => r.includes('E')).findIndex(c => c === 'E')];

  grid[S[0]][S[1]] = 'a';
  grid[E[0]][E[1]] = 'z';

  const distances = grid
    .flatMap((r, rIdx) => r
      .map((_, cIdx) => {
        if (grid[rIdx][cIdx] !== 'a') return Number.MAX_SAFE_INTEGER;

        S = [rIdx, cIdx];

        const queue: [number[], number][] = [[S, 0]];

        const visited = new Set([toS(S)]);

        while (queue.length) {
          const [u, d] = queue.shift();

          if (u[0] === E[0] && u[1] === E[1]) {
            return d;
          }
      
          for (const n of adjacent(u[0], u[1], grid)) {
            if (visited.has(toS(n))) continue;
            visited.add(toS(n));
            queue.push([n, d + 1]);
          }
        }
      
        return Number.MAX_SAFE_INTEGER;
      }))

  return distances.min();
};

console.log(solve(parse(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
