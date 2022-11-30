import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('').map(i => Number.parseInt(i)) };
}

const multiplier = (idx: number, length: number) => {
  const offset = (idx + 1) / length;
  if (Math.floor(offset) % 4 === 0) {
    return 0;
  } else if (Math.floor(offset) % 4 === 1) {
    return 1;
  } else if (Math.floor(offset) % 4 === 2) {
    return 0;
  } else {
    return -1;
  }
}

export const solve = (input: Input): string => {
  let arr = [...input.values];
  for (let i = 0; i < 100; i++) {
    const dest = [];
    for (let j = 0; j < arr.length; j++) {
      let sum = 0;
      for (let k = 0; k < arr.length; k++) {
        sum += multiplier(k, j + 1) * arr[k];
      }
      dest.push(Math.abs(sum) % 10);
    }
    arr = dest;
  }

  return arr.slice(0, 8).join('').toString();
}

assertEquals(solve(parse(['80871224585914546619083218645595'])), '24176176');

console.log(solve(parse(readFile(__dirname))));