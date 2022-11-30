import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('').map(i => Number.parseInt(i)) };
}

const COUNT = 1000000;
const ITER = 10000000;

export const solve = (input: Input): number => {
  let arr = [...input.values, ...range(input.values.length + 1, COUNT)];

  let M = arr.length;

  let next = new Int32Array(M + 1);
  for (let i = 0; i < M; i++) {
    next[arr[i]] = arr[(i + 1) % M] || i + 1;
  }

  let c = arr[0];
  for (let i = 0; i < ITER; i++) {
    const a1 = next[c];
    const a2 = next[a1];
    const a3 = next[a2];

    // Remove
    next[c] = next[a3];

    // Find insertion point
    let a = c - 1 || M;
    while (a1 === a || a2 === a || a3 === a) {
      a = a - 1 || M;
    }

    // Insert
    next[a3] = next[a];
    next[a] = a1;

    // Next round
    c = next[c];
  }

  return next[1] * next[next[1]];
}


console.log(solve(parse(['389125467'])))

console.log(solve(parse(['942387615'])));  
//console.log(solve(parse(readFile(__dirname))));