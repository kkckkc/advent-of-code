import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';
import { stringify } from 'querystring';

type Input = {
  values: Record<string, string>[]
};

const keys = [ 'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' ];

const validations = {
  'byr': (a: string) => a.match(/^[0-9]{4}$/) && Number(a) >= 1920 && Number(a) <= 2002,
  'iyr': (a: string) => a.match(/^[0-9]{4}$/) && Number(a) >= 2010 && Number(a) <= 2020,
  'eyr': (a: string) => a.match(/^[0-9]{4}$/) && Number(a) >= 2020 && Number(a) <= 2030,
  'hgt': (a: string) => ((c=a.match(/^([0-9]+)cm$/), i=a.match(/^([0-9]+)in$/)) => 
    (c && Number(c[1]) >= 150 && Number(c[1]) <= 193) || (i && Number(i[1]) >= 59 && Number(i[1]) <= 76))(),
  'hcl': (a: string) => a.match(/^#[a-f0-9]{6}$/),
  'ecl': (a: string) => a.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/),
  'pid': (a: string) => a.match(/^[0-9]{9}$/)
};


export const parse = (input: string[]): Input => {
  const lines = input.map(l => l.trim() === '' ? '\n' : l).join(' ').split('\n').map(l => l.trim());
  return { 
    values: lines.map(l => Object.fromEntries(l.split(' ').map(a => a.split(':'))))
  };
}

export const solve = (input: Input): string => {
  return input.values.filter(e => keys.every(k => e[k]) && Object.entries(validations).every(([k, v]) => v(e[k]))).length.toString();
}


console.log(solve(parse(readFile(__dirname))));