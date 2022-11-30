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

const expand = (s: string): string[] => {
  const len = s.split('').filter(a => a === 'X').length;

  const dest: string[] = [];
  for (let i = 0; i < 2 ** len; i++) {
    const bitAssignment = i.toString(2).split('').reverse();

    let xidx = 0;
    dest.push(s.split('').map((v) => v === 'X' ? bitAssignment[(len - 1) - (xidx++)] ?? '0' : v).join(''))
  }
  return dest;
}


export const solve = (input: Input): bigint => {
  const mem: Record<number, bigint> = {};

  let masks: bigint[] = [];
  let mask = '';
  for (let instr of input.values) {
    if (instr.instruction === 'mask') {
      masks = expand(instr.value).map(a => BigInt(`0b0${a}`));
      mask = instr.value;
    } else {
      let addr = instr.address!;

      const base = (BigInt(addr) & BigInt(`0b0${mask.replace(/[01]/g, '1').replace(/X/g, '0')}`)) | masks[0];

      for (let m of masks) {
        mem[Number((BigInt(base) | m).toString())] = BigInt(instr.value);
      }
    }
  }

  return Object.values(mem).reduce((acc, c) => acc + c, 0n);
}


console.log(solve(parse(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));