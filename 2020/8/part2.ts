import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: {
    instruction: string,
    arg: number
  }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(s => ({ instruction: s.split(' ')[0], arg: Number(s.split(' ')[1]) })) };
}

export const terminates = (input: Input): number | undefined => {
  const visited = new Set();
  let ip = 0;
  let acc = 0;

  while (ip < input.values.length) {
    if (visited.has(ip)) return undefined;

    visited.add(ip);
    
    const { instruction, arg } = input.values[ip];
    switch (instruction) {
      case 'acc':
        acc += arg;
        ip++;
        break;
      case 'nop':
        ip++;
        break;
      case 'jmp':
        ip += arg;
        break;
      default:
        console.log(`Unknown instruction ${instruction}`);
    }
  }

  return acc;
}

export const solve = (input: Input): number => {
  for (let i = 0; i < input.values.length; i++) {
    const { instruction } = input.values[i];
    switch (instruction) {
      case 'nop':
        input.values[i].instruction = 'jmp';
        const a = terminates(input);
        if (a) return a;
        input.values[i].instruction = 'nop';
        break;
      case 'jmp':
        input.values[i].instruction = 'nop';
        const b = terminates(input);
        if (b) return b;
        input.values[i].instruction = 'jmp';
        break;
    }
  }

  return 0;
}

console.log(solve(parse(readFile(__dirname))));