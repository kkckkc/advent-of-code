import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { binarySearch } from '../../lib/binary-search';

type Input = {
  values: number[]
};

enum OpCode {
  ADD = 1,
  MULT= 2,
  HALT = 99
}

export class Machine {
  memory: number[];
  ip: number;

  constructor(memory: number[]) {
    this.memory = memory;
    this.ip = 0;
  }

  run() {
    while (this.memory[this.ip] !== OpCode.HALT) {
      switch (this.memory[this.ip]) {
        case OpCode.ADD: {
          const [op1, op2, dest] = this.memory.slice(this.ip + 1);
          this.memory[dest] = this.memory[op1] + this.memory[op2];
          this.ip += 4;
          break;
        }
        case OpCode.MULT: {
          const [op1, op2, dest] = this.memory.slice(this.ip + 1);
          this.memory[dest] = this.memory[op1] * this.memory[op2];
          this.ip += 4;
          break;
        }
        case OpCode.HALT:
          return;
        default: 
          throw new Error(`Unknown opcode ${this.memory[this.ip]}`);
      }
    }
  }

  get(ptr: number): number {
    return this.memory[ptr];
  }
}

export const parse = (input: string[]): Input => {
  return { values: input.flatMap(l => l.split(',').map(i => Number.parseInt(i))) };
}

export const solve = (input: Input): string => {
  let noun = binarySearch(0, 100000000, 19690720, (c) => {
    const machine = new Machine([...input.values]);
    machine.memory[1] = c;
    machine.run();
    return machine.get(0);
  }) * -1;

  let verb = binarySearch(0, 100000000, 19690720, (c) => {
    const machine = new Machine([...input.values]);
    machine.memory[1] = noun;
    machine.memory[2] = c;
    machine.run();
    return machine.get(0);
  });

  return (100 * noun + verb).toString();
}

console.log(solve(parse(readFile(__dirname))));