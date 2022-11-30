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

export const solve = (input: Input): number => {
  const visited = new Set();
  let ip = 0;
  let acc = 0;

  while (! visited.has(ip)) {
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
    }
  }

  return acc;
}


console.log(solve(parse(readFile(__dirname))));