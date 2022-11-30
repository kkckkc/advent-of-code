import { Integers } from 'lib/integers';
import { readFile } from 'lib/readFile';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => Number.parseInt(i)) };
}

const target = 27911108;

export const solve = (input: Input): number => {
  for (let i = 0; i < input.values.length; i++) {
    let sum = 0;
    let min = Integers.max;
    let max = 0;
    for (let j = i; j < input.values.length; j++) {
      sum += input.values[j];
      min = Math.min(min, input.values[j]);
      max = Math.max(max, input.values[j]);
      if (sum === target && j !== i) {
        return min + max; 
      } else if (sum > target) {
        break;
      }
    }
  }
  return -1;
}


console.log(solve(parse(readFile(__dirname))));