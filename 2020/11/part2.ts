import { readFile } from '../../lib/readFile';
import { Grids } from 'lib/grid';

type Input = {
  values: string[][],
  colCount: number
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => i.split('')), colCount: input[0].length };
}

const findFirst = (arr: string[][], row: number, col: number, rowD: number, colD: number): string | undefined => {
  let r = row + rowD;
  let c = col + colD;

  while (arr[r]?.[c] !== undefined) {
    if (arr[r]?.[c] !== '.') return arr[r]?.[c];
    r += rowD;
    c += colD;
  }

  return undefined;
}

export const solve = (input: Input): number => {
  let changed;
  let current = input.values;
  do {
    changed = false;
    
    const dest = Grids.clone(current); 

    Grids.forEach(current, (v, grid, row, col) => {
      let adjacent = Grids.adjacent().map(([rd, cd]) => findFirst(grid, row, col, rd, cd)); 
      if (v === 'L' && adjacent.filter(e => e === '#').length === 0) {
        dest[row][col] = '#';
        changed = true;
      } else if (v === '#' && adjacent.filter(e => e === '#').length >= 5) {
        dest[row][col] = 'L';
        changed = true;
      }
    })

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


/*console.log(findFirst(parse(`.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`.split('\n')).values, 4, 3, -1, 0));*/


console.log(solve(parse(readFile(__dirname))));