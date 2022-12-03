import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[][];
};

export const parse = (input: string[]): Input => {
  const values: string[][] = []
  for (let i = 0; i < input.length; i+=3) {
    values.push([input[i], input[i+1], input[i+2]])
  }
  return { values };
};

export const solve = (input: Input): number => {
  let priority = 0;
  for (const [l, ...r] of input.values) {
    const sharedItem = l.split('').find(e => r.every(k => k.includes(e)));
    let prio = sharedItem.charCodeAt(0) - 'a'.charCodeAt(0) + 1
    if (prio < 0)  prio = sharedItem.charCodeAt(0) - 'A'.charCodeAt(0) + 27
    priority += prio;
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
