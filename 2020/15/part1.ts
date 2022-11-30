import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  values: number[]
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split(',').map(i => Number.parseInt(i)) };
}

const findLastIndex = (arr: number[], target: number, start: number) => {
  for (let i = (arr.length - 1 - start); i >= 0; i--) {
    if (arr[i] === target) return i;
  }
  return undefined;
}


export const solve = (input: Input): number => {
  const lastPosition: number[] = [...input.values];
  for (let i = input.values.length; i < 2020; i++) {
    let lastSpoken = lastPosition[i - 1];
    let lastTime = findLastIndex(lastPosition, lastSpoken, 1);

    if (lastTime !== undefined && lastTime !== (i - 1)) {
      lastPosition.push(i - 1 - lastTime);
//      console.log(lastSpoken , lastTime, i - 1 - lastTime);

    } else {
      lastPosition.push(0);
//      console.log(lastSpoken , lastTime, 0);
    }
  }

//console.log(lastPosition);

  return lastPosition[lastPosition.length - 1];
}

console.log(solve({ values: [0, 3, 6]}));
console.log(solve({ values: [1, 2, 3]}));
console.log(solve({ values: [1, 3, 2]}));

console.log(solve(parse(readFile(__dirname))));