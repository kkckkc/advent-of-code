import { readFile } from '../../lib/readFile';

type Input = {
  values: {
    from: number,
    to: number,
    character: string,
    password: string
  }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => {
    const [_, from, end, character, password] = i.match(/^([0-9]+)-([0-9]+) ([a-z]): (.*)$/)!;
    return { password, character, from: Number(from), to: Number(end) };
  }) };
}

export const solve = (input: Input): string => {
  const isOk = (v: { from: number; to: number; character: string; password: string; }): boolean => {
    const chars = Array.from(v.password);
    return (chars[v.from - 1] === v.character) != (chars[v.to - 1] === v.character);
  };

  return input.values.filter(isOk).length.toString();
}

console.log(solve(parse(readFile(__dirname))));