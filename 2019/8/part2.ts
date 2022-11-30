import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range, split, fill } from '../../lib/arrays';
import { findSmallest } from '../../lib/find';
import { asGrid } from '../../lib/format';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('').map(i => Number.parseInt(i)) };
}

export const solve = (input: Input, width: number, height: number): string => {
  const layers = split(input.values, width * height);
  
  let destLayer = fill(width * height, 1);

  layers.reverse().forEach(l => {
    for (let i = 0; i < l.length; i++) {
      destLayer[i] = l[i] === 2 ? destLayer[i] : l[i];
    }
  })

  const textLayer = destLayer.map(e => e === 0 ? '.' : '#');

  return asGrid(textLayer, width);
}

console.log(solve(parse(readFile(__dirname)), 25, 6));