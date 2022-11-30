import { Grids } from 'lib/grid';
import { readFile } from '../../lib/readFile';

type Input = {
  values: string[][],
  colCount: number
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => i.split('')), colCount: input[0].length };
}

export const solve = (input: Input): number => {
  let changed;
  let current = input.values;
  do {
    changed = false;
    
    const dest = Grids.clone(current); 

    Grids.forEach(current, (v, grid, row, col) => {
      const adjacent = Grids.adjacent().map(([rd, cd]) => grid[row + rd]?.[col + cd]);

      if (v === 'L' && adjacent.filter(e => e === '#').length === 0) {
        dest[row][col] = '#';
        changed = true;
      } else if (v === '#' && adjacent.filter(e => e === '#').length >= 4) {
        dest[row][col] = 'L';
        changed = true;
      }
    });

    current = dest;
  } while (changed);

  return Grids.toString(current).filter(e => e === '#').length;
}

console.log(solve(parse(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));