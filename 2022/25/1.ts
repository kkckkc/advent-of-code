import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[];
};

export const parse = (input: string[]): Input => {
  return { values: input };
};

const DECODE = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2
}

const ENCODE = {
  2: '2',
  1: '1',
  0: '0',
  [-1]: '-',
  [-2]: '='
}

let MAX = 22;

const encode = (v: number) => {
  let dest = [];
  for (let i = MAX; i >= 0; i--) {
    const base = Math.pow(5, i);
    let c = 0;
    while (v >= base) {
      c++;
      v -= base;
    }
    dest.push(c);
  }

  for (let i = dest.length - 1; i >= 0; i--) {
    if (dest[i] >= 3) {
      dest[i - 1]++;
      dest[i] = dest[i] - 5;
    }
  }

  for (let i = 0; i < dest.length; i++) {
    if (dest[i] !== 0) {
      return dest.slice(i).map(e => ENCODE[e]).join('');
    }
  }

  throw new Error();
}


export const solve = (input: Input): string => {
  let acc = 0;

  for (const line of input.values) {
    acc += line.split('').reduce(
      (p, c, i) => p + DECODE[c] * Math.pow(5, line.length - i - 1), 
    0)
  }

  return encode(acc);
};

console.log(solve(parse(`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
