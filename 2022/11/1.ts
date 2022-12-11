import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Monkey = {
  items: number[];
  op: string;
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
        op: input[i + 2].split('=')[1],
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
  for (let round = 0; round < 20; round++) {
    for (let m = 0; m < input.values.length; m++) {
      const monkey = input.values[m];
      for (let i = 0; i < monkey.items.length; i++) {
        monkey.inspectCount++;

        let item = monkey.items[i];

        let old = item;
        item = eval(monkey.op);

        item = Math.floor(item / 3);

        if (item % monkey.test === 0) {
          input.values[monkey.testTrue].items.push(item);
        } else {
          input.values[monkey.testFalse].items.push(item);
        }
      }
      monkey.items = [];
    }
/*
    console.log('')
    console.log(`Round ${round + 1}`)
    for (let m = 0; m < input.values.length; m++) {
      console.log(`Monkey ${m}: ${input.values[m].items.join(', ')}`)
    }*/
  }

  const arr = input.values.map(e => e.inspectCount).sort((a, b) => a - b);
  
  return arr.at(-1) * arr.at(-2);
};

//console.log(solve(parse(``.split('\n'))));

console.log(solve(parse(readFile(__dirname, 'sample.txt'))));
console.log(solve(parse(readFile(__dirname))));
