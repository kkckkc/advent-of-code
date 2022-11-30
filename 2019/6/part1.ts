import { stringify } from 'querystring';
import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';

type Input = {
  values: { inner: string, outer: string }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(s => ({ inner: s.split(')')[0], outer: s.split(')')[1] })) };
}

export const solve = (input: Input): string => {
  const tree: Record<string, string[]> = {};
  for (const v of input.values) {
    tree[v.inner] ??= [];
    tree[v.inner].push(v.outer);
  }

  const recurse = (node: string, depth: number): number => {
    const children = tree[node] ?? [];

    let orbits = depth;
    for (const c of children) {
      orbits += recurse(c, depth + 1);
    }
    return orbits;
  }

  return recurse('COM', 0).toString();
}

assertEquals(solve(parse([
  'COM)B',
  'B)C',
  'C)D',
  'D)E',
  'E)F',
  'B)G',
  'G)H',
  'D)I',
  'E)J',
  'J)K',
  'K)L'
])), '42');

console.log(solve(parse(readFile(__dirname))));