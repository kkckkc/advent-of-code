import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range, split } from '../../lib/arrays';
import { findSmallest } from '../../lib/find';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('').map(i => Number.parseInt(i)) };
}

export const solve = (input: Input, width: number, height: number): string => {
  const layers = split(input.values, width * height);
  const { index } = findSmallest(layers, (layer: number[]) => layer.filter(e => e === 0).length);

  return (layers[index].filter(e => e=== 1).length * layers[index].filter(e => e=== 2).length).toString();
}

console.log(solve(parse(readFile(__dirname)), 25, 6));