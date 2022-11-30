import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): number => {
  const differences = [0, 0, 0, 0];
  const values = [0, ...(input.values.sort((a, b) => a - b))];
  for (let i = 1; i < values.length; i++) {
    differences[values[i] - values[i - 1]] += 1;
  }
  return differences[1] * (differences[3] + 1);
}


console.log(solve(parse(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));