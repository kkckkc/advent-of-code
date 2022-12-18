import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from "lib/arrays";
applyPatches();

type Input = {
  values: number[][];
};

export const parse = (input: string[]): Input => {
  return { values: input.map((e) => e.split(",").num()) };
};

const ADJ = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const checkIfAir = (
  x: any,
  y: any,
  z: any,
  dim: number,
  s: Set<string>,
  air: Set<string>
) => {
  const seen = new Set<string>();

  const q = [[x, y, z]];
  if (air.has(q.key())) return;

  while (q.length > 0) {
    const cur = q.pop();

    if (s.has(cur.key())) continue;
    if (cur.some((e) => e <= 0 || e >= dim)) return;

    seen.add(cur.key());
    q.push(...ADJ.map(a => cur.add(a)).filter(e => !seen.has(e.key())));
  }

  [...seen].forEach(s => air.add(s));
};

export const solve = (input: Input): number => {
  const s = new Set<string>();
  input.values.forEach((e) => s.add(e.key()));

  const air = new Set<string>();

  const dim = input.values.flatMap((e) => e).max() + 1;
  for (let x of range(0, dim)) {
    for (let y of range(0, dim)) {
      for (let z of range(0, dim)) {
        checkIfAir(x, y, z, dim, s, air);
      }
    }
  }

  let sides = 0;
  for (const e of input.values) {
    sides += ADJ.map(a => e.add(a).key()).filter((k) => !s.has(k) && !air.has(k)).length;
  }

  return sides;
};

console.log(
  solve(
    parse(
      `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`.split("\n")
    )
  )
);

console.log(solve(parse(readFile(__dirname))));
