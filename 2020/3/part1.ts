import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';
import { Grid, parseGrid } from 'lib/parse';

type Input = Grid<number>;

export const parse = (input: string[]): Input => {
  return parseGrid(input, { '.': 0, '#': 1 });
}

export const solve = (input: Input): string => {
  let row = 0, column = 0, sum = 0;
  while (row < input.rows.length) {
    sum += input.rows[row][column];
    row++;
    column = (column + 3) % input.rowLength;
  }
  return sum.toString()
}


console.log(solve(parse(readFile(__dirname))));