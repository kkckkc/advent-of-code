import {readFile} from "../../lib/readFile";
import { nTuples } from "../../lib/combinatorics";

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


export const solve = (p1: number, p2: number): number => {
  const diceRolls = nTuples([1, 2, 3], 3, 'all').map(a => a.reduce((b, c) => b + c, 0));

  const cache: Record<string, number[]> = {};

  const calculate = (pp1: number, pp2: number, ps1: number, ps2: number): number[] => {
    const key = [pp1, pp2, ps1, ps2].join(',');
    const cached = cache[key];
    if (cached) return cached;

    let numWins = [0, 0];
    for (const d1 of diceRolls) {
      for (const d2 of diceRolls) {
        let npp1 = (pp1 + d1 - 1) % 10 + 1;
        let npp2 = (pp2 + d2 - 1) % 10 + 1;
        let nps1 = ps1 + npp1;
        let nps2 = ps2 + npp2;

        if (nps1 >= 21) {
          numWins[0]++;
          break;
        }

        if (nps2 >= 21) {
          numWins[1]++;
          continue;
        }

        let l = calculate(npp1, npp2, nps1, nps2)
        numWins[0] += l[0]
        numWins[1] += l[1]
      }
    }

    cache[key] = numWins;
    return numWins;
  }


  console.log(calculate(p1, p2, 0, 0));

  return 0;
}



console.log(solve(4, 8));
console.log(solve(7, 5));

