import { permutator } from '../../lib/combinatorics';
import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { threadId } from 'worker_threads';

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
        case OpCode.JMP: {
          const [op1, op2] = this.memory.slice(this.ip + 1);
          if (this.get(op1, mode1) !== 0) {
            this.ip = this.get(op2, mode2);
          } else {
            this.ip += 3;
          }
          break;
        }
        case OpCode.JMPF: {
          const [op1, op2] = this.memory.slice(this.ip + 1);
          if (this.get(op1, mode1) === 0) {
            this.ip = this.get(op2, mode2);
          } else {
            this.ip += 3;
          }
          break;
        }
        case OpCode.LE: {
          const [op1, op2, op3] = this.memory.slice(this.ip + 1);
          this.memory[op3] = this.get(op1, mode1) < this.get(op2, mode2) ? 1 : 0;
          this.ip += 4;
          break;
        }
        case OpCode.EQ: {
          const [op1, op2, op3] = this.memory.slice(this.ip + 1);
          this.memory[op3] = this.get(op1, mode1) === this.get(op2, mode2) ? 1 : 0;
          this.ip += 4;
          break;
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

export const solve = (input: Input): string => {

  let m = 0;
  for (const p of permutator([5, 6, 7, 8, 9])) {
    const machines = [];
    for (let i = 0; i < 5; i++) {
      machines.push(new Machine(input.values));
    }

    let iter = 0;
    let inputToA = 0;
    let halted = false;

    while (! halted) {
      let inp, out;
      
      for (let i = 0; i < 5; i++) {
        if (iter === 0) {
          inp = machines[i].run();
          machines[i].memory[inp.location!] = p[i];
        }
        inp = machines[i].run();
        if (inp.type === IntertupType.HALT) {
          halted = true;
        }
        machines[i].memory[inp.location!] = i === 0 ? inputToA : out?.value!;
        out = machines[i].run();  
        if (out.type === IntertupType.HALT) {
          halted = true;
        }
      }

      if (! halted) {
        inputToA = out?.value!;
      }

      iter++;
    }

    m = Math.max(m, inputToA);
  }

  return m.toString();
}


console.log(solve(parse(readFile(__dirname))));