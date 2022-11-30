import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  player1: number[],
  player2: number[]
};

export const parse = (input: string[]): Input => {
  let player1 = [], player2 = [];

  let p = 1;
  for (const l of input) {
    if (l.trim() === '') continue;
    if (l.trim() === 'Player 2:') p = 2;
    if (l.startsWith('Player')) continue;
    
    if (p === 1) {
      player1.push(Number(l));
    } else {
      player2.push(Number(l));
    }
  }
  return { player1, player2 };
}

export const solve = (input: Input): number => {
  let p1 = [...input.player1];
  let p2 = [...input.player2];

  while (p1.length > 0 && p2.length > 0) {
    const t1 = p1[0], t2 = p2[0];
    if (t1 > t2) {
      p1 = [...p1.slice(1), t1, t2];
      p2 = p2.slice(1);
    } else {
      p1 = p1.slice(1);
      p2 = [...p2.slice(1), t2, t1];
    }
  }

  return [...p1, ...p2].reduce((acc, c, idx, arr) => acc + (c * (arr.length - idx)), 0);
}

console.log(solve(parse(`Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));