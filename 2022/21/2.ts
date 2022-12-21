import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Operation = {
  name: string;
  value?: number;
  operand1?: string;
  operand2?: string;
  operation?: string;
}

type Input = {
  values: Operation[];
};

const OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

export const parse = (input: string[]): Input => {
  return { values: input.map(l => {
    const [name, rest] = l.split(': ');
    if (rest.match(/^[0-9]+$/)) {
      return { name, value: Number(rest) }
    } else {
      const [operand1, operation, operand2] = rest.split(" ");
      return { name, operand1, operand2, operation }
    }
  }) };
};

export const solveInner = (input: Input, humn: number) => {
  const values: Record<string, number> = {};
  const equations = input.values.filter(v => {
    if (v.operand1 !== undefined) return true;
    values[v.name] = v.name === 'humn' ? humn : v.value;
    return false;
  })

  while (values['root'] === undefined) {
    equations.forEach(v => {
      if (!(v.name in values) && v.operand1 in values && v.operand2 in values) {
        values[v.name] = OPS[v.operation](values[v.operand1], values[v.operand2]);
      }
    });
  }

  const root = input.values.find(v => v.name === 'root');
  return Math.abs(values[root.operand1] - values[root.operand2]);
}

export const solve = (input: Input): number => {
  let x = 100;
  let it = 100;

  while (it-- > 0) {
    const fx = solveInner(input, x);
    if (fx === 0) break;
    x -= fx / (solveInner(input, x + 1) - fx);
  }

  return x;
};

console.time()
console.log(solve(parse(`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`.split('\n'))));
console.timeEnd();

console.log('---------------');

console.time()
console.log(solve(parse(readFile(__dirname))));
console.timeEnd();
