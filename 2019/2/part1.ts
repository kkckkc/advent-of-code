import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

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

export const solve = (input: Input, initial: Record<number, number>): string => {
  const machine = new Machine(input.values);

  for (const [k, v] of Object.entries(initial)) {
    machine.memory[k as any as number] = v;
  }

  machine.run();
  return machine.get(0).toString();
}

assertEquals(solve(parse(['1,9,10,3,2,3,11,0,99,30,40,50']), {}), '3500');
assertEquals(solve(parse(['1,1,1,4,99,5,6,0,99']), {}), '30');

console.log(solve(parse(readFile(__dirname)), { 1: 12, 2: 2 }));