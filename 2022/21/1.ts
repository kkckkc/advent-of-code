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

export const solve = (input: Input): number => {
  const values: Record<string, number> = {};
  let remaining = input.values;

  remaining = remaining.filter(v => {
    if (v.operand1 === undefined) {
      values[v.name] = v.value;
      return false;
    }
    return true;
  })

  while (values['root'] === undefined) {
    remaining = remaining.filter(v => {
      if (values[v.operand1] !== undefined && values[v.operand2] !== undefined) {
        if (v.operation === '+') values[v.name] = values[v.operand1] + values[v.operand2];
        else if (v.operation === '-') values[v.name] = values[v.operand1] - values[v.operand2];
        else if (v.operation === '*') values[v.name] = values[v.operand1] * values[v.operand2];
        else if (v.operation === '/') values[v.name] = values[v.operand1] / values[v.operand2];
        else throw new Error(`Unknown operator ''${v.operation}`);

        return false;
      }
      return true;
    });
  }

  return values['root'];
};

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

console.log(solve(parse(readFile(__dirname))));
