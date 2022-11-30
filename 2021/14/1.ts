import {readFile} from "../../lib/readFile";

type Input = {
  start: string;
  transforms: Record<string, string>;
};

export const parse = (input: string[]): Input => {
  return {
    start: input[0],
    transforms: Object.fromEntries(input.slice(2).map(a => a.split(' -> ')))
  }
}

export const solve = (input: Input): number => {
  let s = input.start.split('');
  for (let i = 0; i < 10; i++) {
    s = s.flatMap((a, idx, arr) => {
      if (idx === (arr.length - 1)) return a;
      const p = a + arr[idx + 1];
      const t = input.transforms[p];
      if (!t) return a;
      return [a, t];
    });
  }

  const count: Record<string, number> = {};
  for (const c of s) {
    count[c] = (count[c] ?? 0) + 1;
  }

  let min = Object.entries(count).reduce((p, c) => Math.min(p, c[1]), 10000);
  let max = Object.entries(count).reduce((p, c) => Math.max(p, c[1]), 0);

  return max - min;
}

console.log(solve(parse(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));