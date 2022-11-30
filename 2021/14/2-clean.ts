import { readFile } from "../../lib/readFile";
import { Bag } from "../../lib/bag";
import { findBiggest, findSmallest } from "../../lib/find";

type Input = {
  start: string;
  transforms: Record<string, string>;
};

type PairCount = Record<string, Bag>;

export const parse = (input: string[]): Input => {
  return {
    start: input[0],
    transforms: Object.fromEntries(input.slice(2).map(a => a.split(' -> ')))
  }
}

export const solve = (input: Input): number => {
  const counts: PairCount[] = [];

  for (let i = 0; i < 40; i++) {
    const curr: PairCount = {};
    counts.push(curr);

    for (const [pair, insert] of Object.entries(input.transforms)) {
      let b = curr[pair] = new Bag();

      if (i > 0) {
        b.merge(counts[i - 1][pair[0] + insert]);
        b.merge(counts[i - 1][insert + pair[1]]);
        b.remove(insert);
      } else {
        b.add(pair[0]);
        b.add(pair[1]);
        b.add(insert);
      }
    }
  }

  const d = new Bag();
  for (let i = 0; i < input.start.length - 1; i++) {
    d.merge(counts[counts.length - 1][input.start[i] + input.start[i + 1]]);
    if (i !== input.start.length - 2) d.remove(input.start[i + 1]);
  }

  return findBiggest(d.values()).value - findSmallest(d.values()).value;
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