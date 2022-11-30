import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: {
    instruction: 'mask' | 'mem',
    value: string,
    address?: number
  }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(s => {
    if (s.startsWith('mask')) {
      return {
        instruction: 'mask',
        value: s.split('=')[1].trim()
      };
    } else {
      return {
        instruction: 'mem',
        value: s.split('=')[1].trim(),
        address: Number(s.split('=')[0].split('[')[1].split(']')[0])
      }
    }
  }) };
}

export const solve = (input: Input): bigint => {
  const mem: Record<number, bigint> = {};

  let orMask = 0n;
  let andMask = 0n;
  for (let instr of input.values) {
    if (instr.instruction === 'mask') {
      orMask = BigInt(`0b0${instr.value.replace(/X/g, '0')}`);
      andMask = BigInt(`0b0${instr.value.replace(/X/g, '1')}`);
    } else {
      mem[instr.address!] = (BigInt(instr.value) | orMask) & andMask;
    }
  }

  return Object.values(mem).reduce((acc, c) => acc + c, 0n);
}


console.log(solve(parse(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));