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
  return input.values
    .filter((v) => {
      const count = Array.from(v.password).filter(k => k === v.character).length;
      return count >= v.from && count <= v.to;
    })
    .length.toString();
}


console.log(solve(parse(readFile(__dirname))));