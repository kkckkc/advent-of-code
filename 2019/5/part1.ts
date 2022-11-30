import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: number[]
};

enum OpCode {
  ADD = 1,
  MULT= 2,
  IN = 3,
  OUT = 4,
  HALT = 99
}

enum IntertupType {
  OUTPUT,
  INPUT,
  HALT
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
    while ((this.memory[this.ip] % 100) !== OpCode.HALT) {
      const opcode = this.memory[this.ip] % 100;
      const mode1 = Math.floor(this.memory[this.ip] / 100) % 10;
      const mode2 = Math.floor(this.memory[this.ip] / 1000) % 10;
      const mode3 = Math.floor(this.memory[this.ip] / 10000) % 10;

      switch (opcode) {
        case OpCode.ADD: {
          const [op1, op2, dest] = this.memory.slice(this.ip + 1);
          this.memory[dest] = this.get(op1, mode1) + this.get(op2, mode2);
          this.ip += 4;
          break;
        }
        case OpCode.MULT: {
          const [op1, op2, dest] = this.memory.slice(this.ip + 1);
          this.memory[dest] = this.get(op1, mode1) * this.get(op2, mode2);
          this.ip += 4;
          break;
        }
        case OpCode.IN: {
          const [op1] = this.memory.slice(this.ip + 1);
          this.ip += 2;
          return { type: IntertupType.INPUT, location: op1 };
        }
        case OpCode.OUT: {
          const [op1] = this.memory.slice(this.ip + 1);
          this.ip += 2;
          return { type: IntertupType.OUTPUT, value: this.get(op1, mode1) };
        }
        case OpCode.HALT:
          return { type: IntertupType.HALT };
        default: 
          throw new Error(`Unknown opcode ${this.memory[this.ip]}`);
      }
    }
    return { type: IntertupType.HALT };
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

export const solve = (input: Input, initial: Record<number, number>): string => {
  const machine = new Machine(input.values);

  for (const [k, v] of Object.entries(initial)) {
    machine.memory[k as any as number] = v;
  }

  while (true) {
    const interupt = machine.run();
    if (interupt.type === IntertupType.HALT) {
      return machine.get(0, 0).toString();
    } else if (interupt.type === IntertupType.INPUT) {
      console.log(`> ${interupt.location}`)
      machine.memory[interupt.location!] = 1;
    } else if (interupt.type === IntertupType.OUTPUT) {
      console.log(`< ${interupt.value}`);
    }
  }
}


console.log(solve(parse(readFile(__dirname)), { }));