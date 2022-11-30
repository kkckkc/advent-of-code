import { readFile } from '../../lib/readFile';

const DIRECTIONS: Record<string, number[]> = {
  'se': [1,1],
  'sw': [1, -1],
  'nw': [-1, -1],
  'ne': [-1, 1],
  'e': [0, 2],
  'w': [0, -2]
};

type Input = {
  values: string[][]
};

const parseDirections = (s: string): string[] => {
  const d: string[] = [];
  
  let r = s;

  while (r.length > 0) {
    const dir = Object.keys(DIRECTIONS).find(a => r.startsWith(a));
    if (! dir) throw new Error(`Cannot parse ${r}`)
    d.push(dir);
    r = r.slice(dir.length);
  }

  return d;
} 

export const parse = (input: string[]): Input => {
  return { values: input.map(s => parseDirections(s)) };
}

export const solve = (input: Input): number => {
  const blackTiles: Set<string> = new Set();

  for (const line of input.values) {
    let row = 0, col = 0;

    for (const d of line) {
      row += DIRECTIONS[d][0];
      col += DIRECTIONS[d][1];
    }

    const coord = `${row}:${col}`;
    if (blackTiles.has(coord)) {
      blackTiles.delete(coord);
    } else {
      blackTiles.add(coord);
    }
  }

  return blackTiles.size;
}

console.log(solve(parse(`sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));