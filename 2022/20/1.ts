import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
applyPatches();

type Input = {
  values: number[];
};

export const parse = (input: string[]): Input => {
  return { values: input.num() };
};

export const solve = (input: Input): number => {
  const arr = input.values.map((val, idx) => ({ val, idx }));

  for (let i = 0; i < arr.length; i++) {
    const idx = arr.findIndex(k => k.idx === i);
    const cur = arr[idx];
    arr.splice(idx, 1);
    arr.splice((idx + cur.val) % arr.length, 0, cur);
  }

  const idx = arr.findIndex(k => k.val === 0);
  return range(1, 3).map(x => arr[(idx + 1000 * x) % arr.length].val).sum();
};

console.log(
  solve(
    parse(
      `1
2
-3
3
-2
0
4`.split("\n")
    )
  )
);

console.log(solve(parse(readFile(__dirname))));
