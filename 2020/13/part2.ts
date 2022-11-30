import { readFile } from '../../lib/readFile';
import { Integers } from 'lib/integers';

type Input = {
  base: bigint
  values: bigint[],
  diffs: bigint[]
};

export const parse = (input: string[]): Input => {
  const values = input[1].split(',').slice(1).filter(e => e != 'x').map(e => Number(e));
  const indexes = input[1].split(',').slice(1).map((e, idx) => e === 'x' ? undefined : idx).filter(e => e !== undefined);
  return { 
    base: BigInt(input[1].split(',')[0]),
    values: values.map(e => BigInt(e)),
    diffs: values.map((e, idx) => BigInt(Integers.mod(- (indexes[idx]! + 1), e)))
  };
}

export const solve = (input: Input): bigint => {
  return find([input.base, ...input.values], [0n, ...input.diffs]);
}

export const smallestOccurence = (a: bigint, ad: bigint, b: bigint, bd: bigint, start=ad): bigint => {
  let i = start; 
  while (true) {
    if (((i - bd) % b) === 0n) return i;
    i = i + a;
  }
}

const find = (a: bigint[], d: bigint[]): bigint => {
  const offset = smallestOccurence(a[0], d[0], a[1], d[1]);
  if (a.length === 2) return offset;

  const cycle = smallestOccurence(a[0], d[0], a[1], d[1], offset + a[0]) - offset;

  return find([cycle, ...a.slice(2)], [offset, ...d.slice(2)]);
}


console.log('--------------------------------------------');

console.log(smallestOccurence(17n, 0n, 13n, -2n));
console.log(smallestOccurence(17n, 0n, 13n, -2n, 102n+17n))

console.log(smallestOccurence(17n, 0n, 19n, -3n));
console.log(smallestOccurence(17n, 0n, 19n, -3n, 187n+17n))

console.log(smallestOccurence(221n, 102n, 323n, 187n));


console.log('--------------------------------------------');

console.log(find([17n, 13n, 19n], [0n, -2n, -3n]));
console.log(find([67n, 7n, 59n, 61n], [0n, -1n, -2n, -3n]));
console.log(find([67n, 7n, 59n, 61n], [0n, -2n, -3n, -4n]));
console.log(find([67n, 7n, 59n, 61n], [0n, -1n, -3n, -4n]));
console.log(find([1789n, 37n, 47n, 1889n], [0n, -1n, -2n, -3n]));

console.log('--------------------------------------------');

console.log(solve(parse(`1
17,x,13,19`.split('\n'))))
console.log(solve(parse(`1
67,7,59,61`.split('\n'))))
console.log(solve(parse(`1
67,x,7,59,61`.split('\n'))))
console.log(solve(parse(`1
67,7,x,59,61`.split('\n'))))
console.log(solve(parse(`1
1789,37,47,1889`.split('\n'))))


console.log(solve(parse(readFile(__dirname))));
