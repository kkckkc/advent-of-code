import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Monkey = {
  items: number[];
  op: (old) => number;
  test: number;
  testTrue: number;
  testFalse: number;
  inspectCount: number;
}

type Input = {
  values: Monkey[];
};

const getNum = (s: string) => s.split(/[^0-9]/).filter(a => a !== '').num()

export const parse = (input: string[]): Input => {
  let dest: Monkey[] = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith('Monkey ')) {
      dest.push({
        items: getNum(input[i + 1]),
        // @ts-ignore
        op: new Function('old', `return ${input[i + 2].split('=')[1]}`),
        test: getNum(input[i + 3])[0],
        testTrue: getNum(input[i + 4])[0],
        testFalse: getNum(input[i + 5])[0],
        inspectCount: 0
      });
    }
  }

  return { values: dest };
};

export const solve = (input: Input): number => {
  let items: number[][] = [];

  input.values.forEach(monkey => {
    for (let i = 0; i < monkey.items.length; i++) {
      items.push(input.values.map(m => monkey.items[i] % m.test));
      monkey.items[i] = items.length - 1;
    }
  })

  for (let round = 0; round < 10000; round++) {
    for (let m = 0; m < input.values.length; m++) {
      const monkey = input.values[m];
      for (let i = 0; i < monkey.items.length; i++) {
        monkey.inspectCount++;

        const itemIdx = monkey.items[i];

        items[itemIdx] = items[itemIdx].map((old, idx) => {
          return monkey.op(old) % input.values[idx].test;
        })

        if (items[itemIdx][m] === 0) {
          input.values[monkey.testTrue].items.push(itemIdx);
        } else {
          input.values[monkey.testFalse].items.push(itemIdx);
        }
      }
      monkey.items = [];
    }
  }

  const arr = input.values.map(e => e.inspectCount).sort((a, b) => a - b);
  return arr.at(-1) * arr.at(-2);
};

//console.log(solve(parse(``.split('\n'))));

console.log(solve(parse(readFile(__dirname, 'sample.txt'))));
console.log(solve(parse(readFile(__dirname))));
