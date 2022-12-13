import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { type } from 'os';
applyPatches();

type Input = {
  values: any;
};

const DELIM = ['[[2]]', '[[6]]'];

export const parse = (input: string[]): Input => {
  input = input.concat(DELIM);
  return { values: input.filter(e => e !== '').map(e => eval(e)) };
};

const isRightOrder = (lhs: any, rhs: any) => {
  if (typeof lhs === 'number' && typeof rhs === 'number') {
    return lhs === rhs ? undefined : lhs < rhs;
  } else if (Array.isArray(lhs) && Array.isArray(rhs)) {
    for (let i = 0; i < lhs.length; i++) {
      if (i === rhs.length) return false;
      const s = isRightOrder(lhs[i], rhs[i]);
      if (s !== undefined) return s;
    }
    return lhs.length < rhs.length ? true : undefined;
  }
  return isRightOrder(Array.isArray(lhs) ? lhs : [lhs], Array.isArray(rhs) ? rhs : [rhs]);
}

export const solve = (input: Input): number => {
  input.values.sort((a, b) => isRightOrder(a, b) ? -1 : 1);

  return input.values
    .map((v, i) => (DELIM.includes(JSON.stringify(v)) ? i + 1 : 1))
    .prod();
};

console.log(solve(parse(`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
