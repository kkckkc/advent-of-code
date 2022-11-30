import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: Record<string, string>[]
};

const keys = [ 'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' ];

export const parse = (input: string[]): Input => {
  const lines = input.map(l => l.trim() === '' ? '\n' : l).join(' ').split('\n').map(l => l.trim());
  return { 
    values: lines.map(l => Object.fromEntries(l.split(' ').map(a => a.split(':'))))
  };
}
  
export const solve = (input: Input): string => {
  return input.values.filter(e => keys.every(k => e[k])).length.toString();
}


console.log(solve(parse(readFile(__dirname))));