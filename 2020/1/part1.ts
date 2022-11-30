import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): string => {
  const [k, v] = nTuples(input.values, 2, 'increasing').find(([k, v]) => k + v === 2020)!;
  return (k * v).toString();
}


console.log(solve(parse(readFile(__dirname))));