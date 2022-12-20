import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
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
    const idx = arr.findIndex(({ idx }) => idx === i);
    const [existing] = arr.splice(idx, 1);
    arr.splice((idx + existing.val) % arr.length, 0, existing);
  }

  const zeroIdx = arr.findIndex(({ val }) => val === 0);
  return [1000, 2000, 3000].reduce(
    (e, x) => e + arr[(zeroIdx + x) % arr.length].val,
    0
  );
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
