import { fill, range } from 'lib/arrays';
import { Integers } from 'lib/integers';
import { readFile } from 'lib/readFile';
import { nTuples} from '../../lib/combinatorics';

type Input = {
  tiles: {
    id: number,
    grid: string[][]
  }[]
};

export const parse = (input: string[]): Input => {
  const dest: Input = { tiles: [] };

  for (const line of input) {
    if (line.trim() === '') continue;
    if (line.startsWith('Tile')) {
      dest.tiles.push({
        id: Number(line.split(' ')[1].split(':')[0]),
        grid: []
      })
    } else {
      dest.tiles[dest.tiles.length - 1].grid.push(line.split('').map(a => a === '#' ? '1' : '0'));
    }
  }

  return dest;;
}

const pad10 = (s: string): string => s.length < 10 ? pad10(`0${s}`) : s;

const rotateAndFlip = (s: string[][], rot: number, flip: boolean): string[][] => {
  let d = [...s.map(a => [...a])];

  if (flip) {
    d = d.reverse();
  }

  for (let i = 0; i < rot; i++) {
    const from = [...d.map(d => [...d])];
    for (let row = 0; row < s.length; row++) {
      for (let col = 0; col < s.length; col++) {
        d[row][col] = from[s.length - 1 - col][row];  
      }
    }
  }

  return d;  
}

export const solve = (input: Input): number => {
  const tiles: Record<number, number[]> = {};

  for (const t of input.tiles) {
    tiles[t.id] = [
      Number.parseInt([...t.grid[0]].join(''), 2),
      Number.parseInt([...t.grid].map(l => l[9]).join(''), 2),
      Number.parseInt([...t.grid[9]].reverse().join(''), 2),
      Number.parseInt([...t.grid].map(l => l[0]).reverse().join(''), 2),

      Number.parseInt([...t.grid[9]].join(''), 2), 
      Number.parseInt([...t.grid].map(l => l[9]).reverse().join(''), 2),
      Number.parseInt([...t.grid[0]].reverse().join(''), 2), 
      Number.parseInt([...t.grid].map(l => l[0]).join(''), 2)
    ]
  }

  const count: Record<number, number> = {};

  for (const arr of Object.values(tiles)) {
    for (const a of arr) {
      count[a] = (count[a] ?? 0) + 1;
    }
  }

  const nCount: Record<number, number> = {};
  const corners = [];
  const edges = [];
  for (const [t, v] of Object.entries(tiles)) {
    const a = v.slice(0, 4).filter(a => count[a] > 1).length;
    const b = v.slice(4, 8).filter(a => count[a] > 1).length;
    if ((a === 2 || b === 2) && a <= 2 && b <= 2) {
      corners.push(t);
    }

    if ((a === 3 || b === 3) && a <= 3 && b <= 3) {
      edges.push(t);
    }

    nCount[Number(t)] = a;
  }


  const dimension = Math.sqrt(input.tiles.length);

  const tileMap: Record<number, number[]> = {};
  for (const [t, v] of Object.entries(tiles)) {
    v.forEach(a => tileMap[a] = [Number(t), ...(tileMap[a] ?? [])]);
  }

  const pattern = `
|                  # |
|#    ##    ##    ###|
| #  #  #  #  #  #   |`.split('\n')
  .filter(l => l.trim().length > 0)
  .map(l => l.replace(/|/g, ''))
   .map(l => l.split('').map(a => a === '#' ? 1 : 0));

  const grid = {};

  const r = recurse(grid, 0, 0, dimension, tiles, nCount, count, tileMap, Object.keys(tiles))!;

  const dest = [];
  for (let row = 0; row < (dimension * 10); row++) {
    let line = [];
    for (let col = 0; col < (dimension * 10); col++) {
      if ((row % 10)=== 0 || ((row % 10) === 9)) continue;
      if ((col % 10)=== 0 || ((col % 10) === 9)) continue;

      let [id,,,,,rot,ref] = r[`${Math.floor(row / 10)},${Math.floor(col / 10)}`];

      const s = rotateAndFlip(input.tiles.find(t => t.id === id)!.grid, rot, ref > 0);

      line.push(s[row % 10][col % 10]);
    }
    if (line.length > 0) dest.push(line);
  }

  for (const ref of [false, true]) {
    for (const rot of [0, 1, 2, 3]) {
      const b = rotateAndFlip(dest, rot, ref);
      let gr = [...b.map(a => [...a])];

      let found = false;
      for (let row = 0; row < (dest.length - pattern.length); row++) {
        for (let col = 0; col < (dest.length - pattern[0].length); col++) {
          let ok = true;
          
          for (let pRow = 0; pRow < pattern.length; pRow++) {
            for (let pCol = 0; pCol < pattern[0].length; pCol++) {
              if (pattern[pRow][pCol] === 1 && gr[row + pRow][col + pCol] === '0') {
                ok = false;
              }
            }
          }

          if (ok) {
            for (let pRow = 0; pRow < pattern.length; pRow++) {
              for (let pCol = 0; pCol < pattern[0].length; pCol++) {
                if (pattern[pRow][pCol] === 1) {
                  gr[row + pRow][col + pCol] = 'X';  
                }
              }
            }  
            found = true;
          }
        }
      }

      if (found) {
        return gr.reduce((acc, c) => acc + c.reduce((ia, ic) => ic === '1' ? ia + 1 : ia, 0), 0);
      }
    }
  }


  return 0;
}


const recurse = (grid: Record<string, number[]>, row: number, col: number, dimension: number, 
  tiles: Record<number, number[]>, nCount: Record<number, number>, count: Record<number, number>, tileMap: Record<number, number[]>,
  available: string[]): Record<string, number[]> | undefined => {
  

  const edges: number[] = [-2, -2, -2, -2];

  if (row === 0) {
    edges[0] = -1;
  } else if (row === (dimension - 1)) {
    edges[2] = -1;
  }

  if (col === 0) {
    edges[3] = -1;
  } else if (col === (dimension - 1)) {
    edges[1] = -1;
  }

  if (row > 0) {
    edges[0] = Number.parseInt(pad10(grid[`${row - 1},${col}`][2 + 1].toString(2)).split('').reverse().join(''), 2);
  }

  if (col > 0) {
    edges[3] = Number.parseInt(pad10(grid[`${row},${col - 1}`][1 + 1].toString(2)).split('').reverse().join(''), 2);
  }

  let c = edges.filter(c => c !== -1).length;

  for (const e of available
    .filter(a => nCount[Number(a)] === c)
    .filter(a => edges.every(e => e < 0 || tileMap[e].includes(Number(a))))) {

    const tile = tiles[Number(e)];
    for (const ref of [0, 4]) {
      for (const rot of [0, 1, 2, 3]) {
        const ce = [
          tile[Integers.mod(0 - rot, 4) + ref],
          tile[Integers.mod(1 - rot, 4) + ref],
          tile[Integers.mod(2 - rot, 4) + ref],
          tile[Integers.mod(3 - rot, 4) + ref]
        ];

        if (
          (ce[0] === edges[0] || edges[0] === -2 || (edges[0] === -1 && count[ce[0]] === 1)) &&
          (ce[1] === edges[1] || edges[1] === -2 || (edges[1] === -1 && count[ce[1]] === 1)) &&
          (ce[2] === edges[2] || edges[2] === -2 || (edges[2] === -1 && count[ce[2]] === 1)) &&
          (ce[3] === edges[3] || edges[3] === -2 || (edges[3] === -1 && count[ce[3]] === 1))
        ) {

          const newGrid: Record<string, number[]> = { ...grid, [`${row},${col}`]: [ Number(e), ...ce, rot, ref] };

          if (row === (dimension - 1) && col === (dimension - 1)) return newGrid;

          const newRow = row + ((col === (dimension - 1)) ? 1 : 0);
          const newCol = (col + 1) % dimension;
          const res = recurse(newGrid, newRow, newCol, dimension, tiles, nCount, count, tileMap,
            available.filter(a => a !== e));
          if (res) return res;
        }
      }
    }
  }

  return undefined;
}

console.log(solve(parse(`Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`.split('\n'))))


console.log(solve(parse(readFile(__dirname))));