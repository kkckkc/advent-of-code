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

const encode = (v: number) => {
//  console.log('--', v);

  let dest = [];
  for (let i = 22; i >= 0; i--) {
    const base = Math.pow(5, i);
    let c = 0;
    while (v >= base) {
      c++;
      v -= base;
    }
    dest.push(c);
  }

//  console.log('--', dest);

  for (let i = dest.length - 1; i >= 0; i--) {
    if (dest[i] === 3) {
      dest[i - 1]++;
      dest[i] = -2;
    } else if (dest[i] === 4) {
      dest[i - 1]++;
      dest[i] = -1;
    } else if (dest[i] === 5) {
      dest[i - 1]++;
      dest[i] = 0;
    }
  }

//  console.log('--', dest);

  for (let i = 0; i < dest.length; i++) {
    if (dest[i] !== 0) {
      return dest.slice(i).map(e => ENCODE[e]).join('');
    }
  }

  return 'OVERFLOW';
}


export const solve = (input: Input): string => {
  let acc = 0;

  for (const line of input.values) {
    let len = line.length;
    let v = 0;
    for (let i = 0; i < len; i++) {
      v += DECODE[line.charAt(i)] * Math.pow(5, (len - i - 1));
    }
    //console.log(line, v, encode(v));
    acc += v;
  }

 //console.log(encode(1747))
  return encode(acc);
  //return '';
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
