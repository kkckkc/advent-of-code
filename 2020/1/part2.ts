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
  const [k, v, u] = nTuples(input.values, 3, 'increasing').find(([k, v, u]) => k + v + u === 2020)!;
  return (k * v * u).toString();
}


console.log(solve(parse(readFile(__dirname))));