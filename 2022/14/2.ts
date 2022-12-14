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

export const solve = (input: Input): number => {
  const lines = input.values;

  const maxWidth = lines.flatMap(l => l.map(e => e[0])).max();
  const height = lines.flatMap(l => l.map(e => e[1])).max();

  const grid = range(0, height + 2).map(() => range(0, maxWidth * 2).map(() => '.'));
  range(0, maxWidth * 2).forEach(c => grid[height + 2][c] = '#')

  for (let line of lines) {
    let s = line[0];
    for (let pos of line) {
      if (s[0] === pos[0]) {
        range(s[1], pos[1]).forEach((r) => grid[r][s[0]] = '#')
      } else {
        range(s[0], pos[0]).forEach((c) => grid[s[1]][c] = '#')
      }
      s = pos;
    }
  }

  for (let sandCount = 0; ; sandCount++) {
    let sX = 500;

    for (let r = 0; ; r++) {
      const xOff = [0, -1, 1].find(o => grid[r + 1][sX + o] === '.');
      if (xOff !== undefined) {
        sX += xOff;
      } else {
        grid[r][sX] = 'o';
        break;
      }
    }

    if (grid[0][500] === 'o') return sandCount + 1;
  }
};

console.log(solve(parse(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
