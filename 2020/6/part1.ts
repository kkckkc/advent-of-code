import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: string[]
};

export const parse = (input: string[]): Input => {
  const lines = input.map(l => l.trim() === '' ? '\n' : l).join('').split('\n').map(l => l.trim());
  return { 
    values: lines
  };
}

export const solve = (input: Input): number => {
  return input.values.reduce(
    (acc, cur) => acc + Object.keys(cur.split('').reduce((p, c) => { p[c] = true; return p; }, {} as Record<string, boolean>)).length,
    0)
}


console.log(solve(parse(readFile(__dirname))));