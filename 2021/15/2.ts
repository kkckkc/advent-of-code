import {readFile} from "../../lib/readFile";

type Input = number[][];

const adjacent = (arr: number[][], r: number, c: number) => {
  return [[-1, 0], [0, 1], [1, 0], [0, -1]]
    .map(([dx, dy]) => [r + dy, c + dx])
    .filter(([dy, dx]) => dx >= 0 && dx < arr[0].length && dy >= 0 && dy < arr.length);
}

const wrap = (n: number) => n > 9 ? n % 9 : n;

export const parse = (input: string[]): Input => {
  const dest: number[][] = [];

  for (let i = 0; i < 5; i++) {
    input.map(r => [
      ...(r.split('').map(a => wrap(Number(a) + i + 0))),
      ...(r.split('').map(a => wrap(Number(a) + i + 1))),
      ...(r.split('').map(a => wrap(Number(a) + i + 2))),
      ...(r.split('').map(a => wrap(Number(a) + i + 3))),
      ...(r.split('').map(a => wrap(Number(a) + i + 4))),
    ]).forEach(a => dest.push(a))
  }
  return dest;
}

export const solve = (input: Input): number => {
  let shortest = input.map(r => r.map(_ => Number.MAX_SAFE_INTEGER));
  shortest[0][0] = 0;

  let q = [[0, 0]];
  while (q.length > 0) {
    let [r, c] = q.shift()!;
    let best = shortest[r][c];
    for (const [r1, c1] of adjacent(input, r, c)) {
      if (best + input[r1][c1] < shortest[r1][c1]) {
        shortest[r1][c1] = best + input[r1][c1];
        q.push([r1, c1]);
      }
    }
  }


  const lastRow = shortest[shortest.length - 1];
  return lastRow[lastRow.length - 1];
}

console.log(solve(parse(`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));