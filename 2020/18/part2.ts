import { readFile } from '../../lib/readFile';
import { fixedPoint } from 'lib/algorithms';

type Input = {
  values: string[]
};

export const parse = (input: string[]): Input => {
  return { values: input };
}

const evalOp = (lv: string, rv: string, op: string): number => {
  if (op === '*') return Number(lv) * Number(rv);
  if (op === '+') return Number(lv) + Number(rv);
  return -1;
}

const solveExpression = (s: string): number => {
  let p;
  let tokens: any[] = fixedPoint(s, (d) => d.replace(/\(([^\)\()]+)\)/g, (_, p1) => solveExpression(p1).toString())).split(' ');

  while ((p = tokens.findIndex(t => t === '+')) >= 0) {
    tokens.splice(p - 1, 3, evalOp(tokens[p - 1], tokens[p + 1], '+'));
  }

  while ((p = tokens.findIndex(t => t === '*')) >= 0) {
    tokens.splice(p - 1, 3, evalOp(tokens[p - 1], tokens[p + 1], '*'));
  }

  return tokens[0];
}

export const solve = (input: Input): number => {
  return input.values.map(s => solveExpression(s)).reduce((acc, c) => acc + c, 0);
}


console.log(solveExpression('2 * 3 + 4'))
console.log(solveExpression('1 + (2 * 3) + (4 * (5 + 6))'))
console.log(solveExpression('2 * 3 + (4 * 5)'))
console.log(solveExpression('5 + (8 * 3 + 9 + 3 * 4 * 3)'))
console.log(solveExpression('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'))
console.log(solveExpression('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'))

console.log(solve(parse(readFile(__dirname))));