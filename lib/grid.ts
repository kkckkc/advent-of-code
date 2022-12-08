import { range } from './arrays';

export const Grids = {
  adjacent: (includeSelf=false) => [[-1,-1], [-1,0], [-1,1], ...(includeSelf ? [[0, 0]]: []), [0,-1], [0,1], [1,-1], [1,0], [1,1]],

  clone: <T>(grid: T[][]) => grid.map(e => e.slice(0)),

  toString: (grid: string[][]) => grid.map(e => e.join('')).join('\n').split(''),

  forEach: <T>(grid: T[][], fn: ((value: T, grid: T[][], row: number, col: number) => void)) => {
    for (let col = 0; col < grid[0].length; col++) {
      for (let row = 0; row < grid.length; row++) {
        fn(grid[row][col], grid, row, col);
      }
    }
  }
}

export class Grid<T> {
  data: T[][];
  
  constructor(data: T[][]) {
    this.data = data;
  }

  column(col: number): T[] {
    return range(0, this.data.length - 1).map(r => this.data[r][col]);
  }

  row(row: number): T[] {
    return this.data[row];
  }

  at(row: number, column: number) {
    return this.data[row][column];
  }

  width() {
    return this.data[0].length;
  }

  height() {
    return this.data.length;
  }
}