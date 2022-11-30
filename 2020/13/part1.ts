import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';
import { Integers } from 'lib/integers';

type Input = {
  target: number,
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { 
    target: Number(input[0]),
    values: input[1].split(',').filter(s => s !== 'x').map(i => Number.parseInt(i)) 
  };
}

export const solve = (input: Input): number => {
  for (let i = input.target; i < Integers.max; i++) {
    const match = input.values.find(v => (i % v) === 0);
    if (match) {
      return (i - input.target) * match;
    }
  }
  return -1;
}


console.log(solve(parse(`939
7,13,x,x,59,x,31,19`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));