import { readFile } from '../../lib/readFile';

type Input = {
  values: string[]
};

export const parse = (input: string[]): Input => {
  return { values: input };
}

export const solve = (input: Input): number => {
  return (input.values
    .map(v => v.replace(/F|L/g, '0').replace(/B|R/g, '1'))
    .map(e => Number.parseInt(e, 2))
    .sort()
    .find((_, i, arr) => arr[i + 1] - arr[i] === 2)! + 1);
}


console.log(solve(parse(readFile(__dirname))));