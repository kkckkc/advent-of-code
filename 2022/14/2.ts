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
  let height = lines.flatMap(l => l.map(e => e[1])).max();

  const grid = range(0, height + 2).map(() => range(0, maxWidth * 2).map(() => '.'));

  for (let l of lines) {
    let s = l[0];
    for (let i = 1; i < l.length; i++) {
      if (s[0] === l[i][0]) {
        range(s[1], l[i][1]).forEach((r) => grid[r][s[0]] = '#')
      } else {
        range(s[0], l[i][0]).forEach((c) => grid[s[1]][c] = '#')
      }
      s = l[i];
    }
  }

  for (let sandCount = 0; ; sandCount++) {
    let sX = 500;

    for (let r = 0; ; r++) {
      if (r === height + 1) {
        grid[r][sX] = 'o';
        break;
      }
      if (grid[r + 1][sX] === '.') {
      } else if (grid[r + 1][sX - 1] === '.') {
        sX--;
      } else if (grid[r + 1][sX + 1] === '.') {
        sX++;
      } else {
        grid[r][sX] = 'o';
        if (r === 0 && sX === 500) return sandCount + 1;
        break;
      }
    }
  }
};

console.log(solve(parse(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
