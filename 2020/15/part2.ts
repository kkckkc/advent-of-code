import { fill, range } from 'lib/arrays';
import { readFile } from '../../lib/readFile';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split(',').map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): number => {
  const positions = new Int32Array(30000000);

  for (let i = 0; i < input.values.length; i++) {
    positions[input.values[i]] = i + 1;
  }

  let last = input.values[input.values.length - 1];
  let lastPosition = 0;
  for (let i = input.values.length; i < positions.length; i++) {
    last = lastPosition ? i - lastPosition : 0;

    lastPosition = positions[last];
    positions[last] = i + 1;
  }

  return last;
}

//console.log(solve({ values: [0, 3, 6]}));
//console.log(solve({ values: [1, 2, 3]}));
//console.log(solve({ values: [1, 3, 2]}));

for (let i = 0; i < 10; i++) {
  console.log(solve(parse(readFile(__dirname))));
}
