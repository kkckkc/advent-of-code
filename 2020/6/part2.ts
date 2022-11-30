import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: string[]
};

export const parse = (input: string[]): Input => {
  const lines = input.map(l => l.trim() === '' ? '\n' : l).join(' ').split('\n').map(l => l.trim());
  return { 
    values: lines
  };
}

export const solve = (input: Input): number => {
  let total = 0;
  for (const s of input.values) {
    const answers = s.split(' ');

    total += Object.entries(answers
        .flatMap((a) => a.split(''))
        .reduce((p, e) => { p[e] = (p[e] ?? 0) + 1; return p; }, {} as Record<string, number>)
      )
      .filter(([_, v]) => v === answers.length)
      .length;
  }
  return total;
}


console.log(solve(parse(readFile(__dirname))));