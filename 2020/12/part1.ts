import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';
import { Points } from 'lib/geometry';
import { Integers } from 'lib/integers';

type Input = {
  values: { 
    direction: string,
    len: number
  }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(i => ({ direction: i[0], len: Number.parseInt(i.slice(1)) })) };
}

export const solve = (input: Input): number => {
  let current = Points.origin();
  let direction = 'E';

  const directions = ['N', 'E', 'S', 'W'];

  for (const v of input.values) {
    switch (v.direction === 'F' ? direction : v.direction) {
      case 'N':
        current = Points.addVector(current, { x: 0, y: v.len });
        break;
      case 'S':
        current = Points.addVector(current, { x: 0, y: -v.len });
        break;
      case 'W':
        current = Points.addVector(current, { x: -v.len, y: 0 });
        break;
      case 'E':
        current = Points.addVector(current, { x: v.len, y: 0 });
        break;
      case 'L':
        direction = directions[Integers.mod((directions.findIndex(d => d === direction) - (v.len / 90)), 4)];
        break;
      case 'R':
        direction = directions[Integers.mod((directions.findIndex(d => d === direction) + (v.len / 90)), 4)];
        break;  
    }
  }

  return Points.manhattanDistance(current);
}


console.log(solve(parse(`F10
N3
F7
R90
F11`.split('\n'))));



console.log(solve(parse(readFile(__dirname))));