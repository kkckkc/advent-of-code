import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  min: number,
  max: number
};

export const parse = (input: string): Input => {
  return { min: Number.parseInt(input.split('-')[0]), max: Number.parseInt(input.split('-')[1]) };
}

export const solve = (input: Input): string => {
  let matches = 0;
  for (let pwd = input.min; pwd < input.max; pwd++) {
    const [c1, c2, c3, c4, c5, c6] = pwd.toString().split('').map(a => Number.parseInt(a));
    const increasing = (c1 <= c2 && c2 <= c3 && c3 <=c4 && c4 <=c5 && c5 <= c6);
    const hasDouble = (c1 === c2 || c2 === c3 || c3 === c4 || c4 === c5 || c5 === c6);
    if (increasing && hasDouble) matches++;
  }
  return matches.toString();
}


console.log(solve(parse('136818-685979')));