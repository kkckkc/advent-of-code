import { permutations } from '../../lib/combinatorics';
import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';

type Input = {
  values: number[]
};

enum OpCode {
  ADD = 1,
  MULT= 2,
  IN = 3,
  OUT = 4,
  JMP = 5,
  JMPF = 6,
  LE = 7,
  EQ = 8,
  HALT = 99
}

enum IntertupType {
  OUTPUT = 'Output',
  INPUT = 'Input',
  HALT = 'Halt'
}

type Interupt = {
  type: IntertupType,
  location?: number,
  value?: number,
}

export class Machine {
  memory: number[];
  ip: number;

  constructor(memory: number[]) {
    this.memory = memory;
    this.ip = 0;
  }

  run(): Interupt {
    while (true) {
      const op = this.memory[this.ip];

      const opcode = op % 100;
      const mode1 = Math.floor(op / 100) % 10;
      const mode2 = Math.floor(op / 1000) % 10;
      //const mode3 = Math.floor(op / 10000) % 10;

      switch (opcode) {
        case OpCode.ADD: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];
          const dest = this.memory[this.ip + 3];

          this.memory[dest] = this.get(op1, mode1) + this.get(op2, mode2);
          this.ip += 4;
          break;
        }
        case OpCode.MULT: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];
          const dest = this.memory[this.ip + 3];

          this.memory[dest] = this.get(op1, mode1) * this.get(op2, mode2);
          this.ip += 4;
          break;
        }
        case OpCode.IN: {
          const op1 = this.memory[this.ip + 1];

          this.ip += 2;
          return { type: IntertupType.INPUT, location: op1 };
        }
        case OpCode.OUT: {
          const op1 = this.memory[this.ip + 1];

          this.ip += 2;
          return { type: IntertupType.OUTPUT, value: this.get(op1, mode1) };
        }
        case OpCode.JMP: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];

          if (this.get(op1, mode1) !== 0) {
            this.ip = this.get(op2, mode2);
          } else {
            this.ip += 3;
          }
          break;
        }
        case OpCode.JMPF: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];

          if (this.get(op1, mode1) === 0) {
            this.ip = this.get(op2, mode2);
          } else {
            this.ip += 3;
          }
          break;
        }
        case OpCode.LE: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];
          const dest = this.memory[this.ip + 3];

          this.memory[dest] = this.get(op1, mode1) < this.get(op2, mode2) ? 1 : 0;
          this.ip += 4;
          break;
        }
        case OpCode.EQ: {
          const op1 = this.memory[this.ip + 1];
          const op2 = this.memory[this.ip + 2];
          const dest = this.memory[this.ip + 3];

          this.memory[dest] = this.get(op1, mode1) === this.get(op2, mode2) ? 1 : 0;
          this.ip += 4;
          break;
        }
        case OpCode.HALT:
          return { type: IntertupType.HALT };
        default: 
          throw new Error(`Unknown opcode ${this.memory[this.ip]}`);
      }
    }
  }

  get(ptr: number, mode: number): number {
    if (mode === 0) {
      return this.memory[ptr];
    } else {
      return ptr;
    }
  }
}

export const parse = (input: string[]): Input => {
  return { values: input.flatMap(l => l.split(',').map(i => Number.parseInt(i))) };
}

export const solve = (input: Input): string => {
  let m = 0;
  for (let i = 0; i < 2000; i++)
  for (const p of permutations([0, 1, 2, 3, 4])) {
    const machines = range(0, 4).map(_ => new Machine(input.values));

    let carry = 0;
    machines.forEach((m, idx) => {
      m.memory[m.run().location!] = p[idx];
      
      m.memory[m.run().location!] = carry;

      carry = m.run().value!;
    });

    m = Math.max(m, carry);
  }

  return m.toString();
}


console.log(solve(parse(readFile(__dirname))));