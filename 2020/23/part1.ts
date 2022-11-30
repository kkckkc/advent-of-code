import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('').map(i => Number.parseInt(i)) };
}

const ITER = 100;

export const solve = (input: Input): string => {
  let arr = [...input.values];
  let M = arr.length;
  for (let i = 0; i < ITER; i++) {
    console.log(`-- move ${i + 1} --`);

    const c = arr[i % M];

    console.log(`cups ${arr.map(e => e === c ? `(${e})` : e.toString()).join(' ')}`)

    const three = [arr[(i + 1) % M], arr[(i + 2) % M], arr[(i + 3) % M]];

    console.log(`pick up: ${three.join(', ')}`)

    let a = c === 1 ? M : c - 1;
    while (three.includes(a)) {
      a = a === 1 ? M : a - 1;
    }

    let d: number[] = arr.filter(e => !three.includes(e));

    const p = d.findIndex(k => k === a)!;

    console.log(`destination: ${a}, ${p}`)


    d.splice(p + 1, 0, ...three); //[...d.slice(0, p+ 1), ...three, ...d.slice(p+1)]

    console.log(`raw: ${d.join(',')}`);

    if (d.length > M) {
      d[0] = d[0] ?? d[d.length];
      d[1] = d[1] ?? d[d.length + 1];
      d[2] = d[2] ?? d[d.length + 2];
    }

    arr = d.slice(0, M);

    let rot = 0;
    while (arr[i % M] !== c) {
      arr = [...arr.slice(1), arr[0]];
      console.log(`rotate: ${arr.join(',')} ${arr[i]} ${c}`);
      
      if (rot++ > 10) process.exit(1);
    }

    console.log('');
  }

  const s = [];
  const one = arr.findIndex(e => e === 1)! + 1;
  for (let i = 0; i < M; i++) {
    s.push(arr[(one + i) % M]);
  }
  return s.filter(e => e !== 1).join('');
}


console.log(solve(parse(['389125467'])))

console.log(solve(parse(['942387615'])));
//console.log(solve(parse(readFile(__dirname))));