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

