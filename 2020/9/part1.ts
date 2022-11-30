import { readFile } from 'lib/readFile';

type Input = number[];

export const parse = (input: string[]): Input => {
  return input.map(i => Number.parseInt(i));
}

export const solve = (input: Input): number => {
  for (let i = 25; i < input.values.length; i++) {
    let found = false;
    for (let j = i - 25; j < i; j++) {
      for (let k = j + 1; k < i; k++) {
        if (input[i] == input[j] + input[k]) {
          found = true;
        }
      }
    }
    if (! found) {
      return input[i];
    }
  }
  return -1;
}


console.log(solve(parse(readFile(__dirname))));