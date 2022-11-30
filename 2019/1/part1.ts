import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): string => {
  return input.values.reduce((a, v) => a + Math.floor(v / 3) - 2, 0).toString();
}

assertEquals(solve(parse(['12'])), '2');
assertEquals(solve(parse(['14'])), '2');
assertEquals(solve(parse(['1969'])), '654');
assertEquals(solve(parse(['100756'])), '33583');

assertEquals(solve(parse(['12', '14'])), '4');

console.log(solve(parse(readFile(__dirname))));