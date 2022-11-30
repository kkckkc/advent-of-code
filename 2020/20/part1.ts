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

export const solve = (input: Input): number => {
  const tiles: Record<number, number[]> = {};

//  console.log(input.tiles.find(t => t.id === 1427));

  for (const t of input.tiles) {
    tiles[t.id] = [
      Number.parseInt([...t.grid[0]].join(''), 2),
      Number.parseInt([...t.grid].map(l => l[9]).join(''), 2),
      Number.parseInt([...t.grid[9]].reverse().join(''), 2),
      Number.parseInt([...t.grid].map(l => l[0]).reverse().join(''), 2),

      Number.parseInt([...t.grid[0]].reverse().join(''), 2),
      Number.parseInt([...t.grid].map(l => l[9]).reverse().join(''), 2),
      Number.parseInt([...t.grid[9]].join(''), 2),
      Number.parseInt([...t.grid].map(l => l[0]).join(''), 2)
    ]
  }

  const count: Record<number, number> = {};

  for (const arr of Object.values(tiles)) {
    for (const a of arr) {
      count[a] = (count[a] ?? 0) + 1;
    }
  }

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
  }

  console.log(corners);
  console.log(edges.length);

  return corners.reduce((acc, p) => acc * Number(p), 1);
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