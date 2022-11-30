import { readFile } from '../../lib/readFile';

type Input = {
  players: number[][]
};

export const parse = (input: string[]): Input => {
  const players: number[][] = [[], []];

  let p = 0;
  for (const l of input.filter(l => l.trim() !== '')) {
    if (l.trim() === 'Player 2:') p = 1;
    if (l.startsWith('Player')) continue;
    
    players[p].push(Number(l));
  }
  return { players };
}

const play = (p1: number[], p2: number[]): [number, number[], number[]] => {
  let prev1 = new Set<string>();
  let prev2 = new Set<string>();

  let winner = undefined;

  while (p1.length > 0 && p2.length > 0) {
    const d1 = p1.join(',');
    const d2 = p2.join(',');

    if (prev1.has(d1) && prev2.has(d2)) {
      return [1, p1, p2];
    }

    prev1.add(d1);
    prev2.add(d2);

    let roundWinner;

    const t1 = p1[0], t2 = p2[0];
    if (p1.length > t1 && p2.length > t2) {
      [roundWinner,,] = play(p1.slice(1, 1 + t1), p2.slice(1, 1 + t2)); 

    } else {
      roundWinner = (t1 > t2) ? 1 : 2;
    }
  
    if (roundWinner === 1) {
      p1 = [...p1.slice(1), t1, t2];
      p2 = p2.slice(1);
    } else {
      p1 = p1.slice(1);
      p2 = [...p2.slice(1), t2, t1];
    }
  }

  return [winner ?? (p1.length > p2.length) ? 1 : 2, p1, p2];
}

export const solve = (input: Input): number => {
  let [winner, p1, p2] = play([...input.players[0]], [...input.players[1]]);

  return (winner === 1 ? p1 : p2).reduce((acc, c, idx, arr) => acc + (c * (arr.length - idx)), 0);
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

console.log(solve(parse(`Player 1:
43
19

Player 2:
2
29
14`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));