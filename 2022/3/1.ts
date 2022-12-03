import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(l => [l.slice(0, l.length / 2), l.slice(l.length / 2)]) };
};

export const solve = (input: Input): number => {
  let priority = 0;
  for (const [l, r] of input.values) {
    const sharedItem = l.split('').find(e => r.includes(e));
    let prio = sharedItem.charCodeAt(0) - 'a'.charCodeAt(0) + 1
    if (prio < 0)  prio = sharedItem.charCodeAt(0) - 'A'.charCodeAt(0) + 27
    priority += prio;
//    console.log(sharedItem, prio)
  }
  return priority;
};

console.log(solve(parse(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.split('\n'))));
console.log(solve(parse(readFile(__dirname))));
