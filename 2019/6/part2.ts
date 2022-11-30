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

  const pathTo = (node: string, find: string, path: string[]): string[] | undefined => {
    if (node === find) return path;
    const children = tree[node] ?? [];

    for (const c of children) {
      const p = pathTo(c, find, [...path, c]);
      if (p) return p;
    }

    return undefined;
  }

  const you = pathTo('COM', 'YOU', [])!;
  const san = pathTo('COM', 'SAN', [])!;

  let moves = you.length + san.length - 2;

  let i = 0;
  while (i < you.length && i < san.length && you[i] == san[i]) {
    moves -= 2;
    i++;
  }
  
  return moves.toString();
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
  'K)L',
  'K)YOU',
  'I)SAN'
])), '4');

console.log(solve(parse(readFile(__dirname))));