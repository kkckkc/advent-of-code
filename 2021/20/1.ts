import {readFile} from "../../lib/readFile";

type Pair = {
  left: Pair | number;
  right: Pair | number;
  parent: Pair | undefined;
  type: 'right' | 'left' | 'root'
}

type Input = {
  rule: number[],
  board: number[][]
};

export const parse = (input: string[]): Input => {
  return {
    rule: input[0].split('').map(a => a === '.' ? 0 : 1),
    board: input.slice(2).map(r => r.split('').map(a => a === '.' ? 0 : 1))
  }
}

const getNum = (b: Record<string, number>, r: number, c: number, d: number) => {
  const bits = [
    b[`${r - 1},${c - 1}`] ?? d,
    b[`${r - 1},${c}`] ?? d,
    b[`${r - 1},${c + 1}`] ?? d,
    b[`${r},${c - 1}`] ?? d,
    b[`${r},${c}`] ?? d,
    b[`${r},${c + 1}`] ?? d,
    b[`${r + 1},${c - 1}`] ?? d,
    b[`${r + 1},${c}`] ?? d,
    b[`${r + 1},${c + 1}`] ?? d
  ];
  return Number.parseInt(
    bits.map(k => k.toString()).join(''),
    2
  )
}

function printBoard(nib: Set<string>, sr: number, er: number, sc: number, ec: number) {
  console.log('-------------')
  for (let r = sr; r < er; r++) {
    let line = '';
    for (let c = sc; c < ec; c++) {
      line += nib.has(`${r},${c}`) ? '#' : '.';
    }
    console.log(line);
  }
}

export const solve = (input: Input): number => {
  let ib: Record<string, number> = {};
  input.board.forEach((r, ri) => r.forEach((c, ci) => ib[`${ri},${ci}`] = c))

  let d = 0;
  let sr = 0, er = input.board.length, sc = 0, ec = input.board[0].length;
  for (let i = 0; i < 2; i++) {
    let nib: Record<string, number> = {};

    console.log(sr, er, sc, ec)
    //printBoard(ib, sr, er, sc, ec);

    const oer = er, oec = ec, osc = sc;
    for (let r = sr - 10; r < (er + 10); r++) {
      for (let c = sc - 10; c < (ec + 10); c++) {
        let n = getNum(ib, r, c, d);
        nib[`${r},${c}`] = input.rule[n];
      }
    }

    ib = nib;
    er += 3;
    sr -= 3;
    ec += 3;
    sc -= 3;
    d = input.rule[getNum(ib, sr - 1000, sc - 1000, d)]
  }

  return Object.values(ib).filter(a => a === 1).length;
}


console.log(solve(parse(`..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`.split('\n'))));



console.log(solve(parse(readFile(__dirname))));