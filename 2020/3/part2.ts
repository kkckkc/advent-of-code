import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';
import { parseGrid, Grid } from '../../lib/parse';

type Input = Grid<number>;

export const parse = (input: string[]): Input => {
  return parseGrid(input, { '.': 0, '#': 1 });
}

const slopeTotal = (input: Input, rowDelta: number, colDelta: number) => {
  let row = 0, column = 0, sum = 0;
  while (row < input.rows.length) {
    sum += input.rows[row][column];
    row += rowDelta;
    column = (column + colDelta) % input.rowLength;
  }
  return sum;
}

export const solve = (input: Input): string => {
  return (slopeTotal(input, 1, 1) * slopeTotal(input, 1, 3) * slopeTotal(input, 1, 5) * slopeTotal(input, 1, 7) * slopeTotal(input, 2, 1)).toString()
}


console.log(solve(parse(readFile(__dirname))));