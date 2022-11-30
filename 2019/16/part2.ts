import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { fill } from '../../lib/arrays';

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

export const solve = (input: Input, offsetLen: number): string => {
  const totalLength = input.values.length * 10000;
  const offset = Number(input.values.slice(0, offsetLen).join('').toString());

  let arr = [];
  for (let j = offset; j < totalLength; j++) {
    arr[j - offset] = input.values[j % input.values.length];
  }

  for (let i = 0; i < 100; i++) {
    for (let j = totalLength - 2; j >= offset; j--) {
      arr[j - offset] = (arr[j - offset] + arr[j - offset + 1]) % 10;
    }
  }

  return arr.slice(0, 8).join('').toString();
}

console.log(solve(parse(['03036732577212944063491565474664']), 7));
console.log(solve(parse(['02935109699940807407585447034323']), 7));
console.log(solve(parse(['03081770884921959731165446850517']), 7));
console.log(solve(parse(readFile(__dirname)), 7));