import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[];
};

export const parse = (input: string[]): Input => {
  return { values: input };
};

export const solve = (input: Input): number => {
  let regX = 1;
  let ip = 0;
  let clk = 0;
  let instrState: number = 0;

  let acc = 0;

  while (true) {
    if (((clk + 1) - 20) % 40 === 0) {
      acc += (clk + 1) * regX;
//      console.log(clk + 1, (clk + 1) * regX)
    }

    // Fetch
    if (ip === input.values.length) break;
    let instr = input.values[ip];

    // Decode
    let decoded = instr.split(" ");
    if (instrState === 0) {
      if (decoded[0] === 'addx') instrState = 2;
      else instrState = 1;
    }

    // Execute
    instrState--;
    if (decoded[0] === 'addx') {
      if (instrState === 0) regX += Number(decoded[1]);
    }

    clk++;
    if (instrState === 0) ip++;
  }

  return acc;
};

console.log(solve(parse(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
