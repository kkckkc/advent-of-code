import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): string => {
  const equation = (v: number): number => Math.floor(v / 3) - 2;

  const fuelRequirements = (v: number) => {
    let sum = 0;
    let f = equation(v);
    while (f > 0) {
      sum += f;
      f = equation(f);
    }
    return sum;
  }

  return input.values.reduce((a, v) => a + fuelRequirements(v), 0).toString();
}

assertEquals(solve(parse(['14'])), '2');
assertEquals(solve(parse(['1969'])), '966');
assertEquals(solve(parse(['100756'])), '50346');

console.log(solve(parse(readFile(__dirname))));