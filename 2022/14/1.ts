import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
applyPatches();

type Input = {
  values: number[][][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(l => l.split(' -> ').map(e => e.split(',').num())) };
};

const printGrid = (grid: string[][], minw: number, maxw: number) => {
  for (const l of grid) {
    console.log(l.slice(minw - 1, maxw + 1).join(''))
  }
  console.log();
}

export const solve = (input: Input): number => {
  const lines = input.values;
  let maxWidth = lines.flatMap(l => l.map(e => e[0])).max();
  let minWidth = lines.flatMap(l => l.map(e => e[0])).min();
  let height = lines.flatMap(l => l.map(e => e[1])).max();

  const grid = range(0, height + 1).map(() => range(0, maxWidth + 1).map(() => '.'));

  for (let l of lines) {
    let s = l[0];
    for (let i = 1; i < l.length; i++) {
      if (s[0] === l[i][0]) {
        range(Math.min(s[1], l[i][1]), Math.max(s[1], l[i][1]))
          .forEach((r) => grid[r][s[0]] = '#')
      } else {
        range(Math.min(s[0], l[i][0]), Math.max(s[0], l[i][0]))
          .forEach((c) => grid[s[1]][c] = '#')
      }
      s = l[i];
    }
  }

  let sandCount = 0;
  while (true) {
    //printGrid(grid, minWidth, maxWidth);

    let s = [0, 500];

    // fall
    while (true) {
      if (s[0] === height) return sandCount;
      if (grid[s[0] + 1][s[1]] === '.') {
        s[0]++;
      } else if (grid[s[0] + 1][s[1] - 1] === '.') {
        s[0]++;
        s[1]--;
      } else if (grid[s[0] + 1][s[1] + 1] === '.') {
        s[0]++;
        s[1]++;
      } else {
        grid[s[0]][s[1]] = 'o';
        break;
      }
    }

    sandCount++;
  }


  return 0;
};

console.log(solve(parse(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
