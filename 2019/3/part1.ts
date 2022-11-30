import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { Line, Lines, Point, Points, Vector, Vectors } from '../../lib/geometry';
import { cartesianProduct } from '../../lib/combinatorics';

type Input = {
  wire1: string[],
  wire2: string[]
};

export const parse = (input: string[]): Input => {
  return { 
    wire1: input[0].split(','),
    wire2: input[1].split(',')
  };
}

type Wire = { idx: number } & Line;

const parseWire = (input: string[]): Wire[] => {
  const dest: Wire[] = [];

  let start = Points.origin();
  for (const s of input) {
    const end = Points.addVector(start, Vectors.parseOrthogonalVector(s));
    dest.push({ idx: dest.length, ...Lines.make(start, end) });
    start = end;
  }

  return dest;
}

export const solve = (input: Input): string => {
  const wire1 = parseWire(input.wire1);
  const wire2 = parseWire(input.wire2);

  let minDistance = 1000000000;

  for (const [c1, c2] of cartesianProduct(wire1, wire2)) {
    const p = Lines.intersection(c1, c2);
    if (p && !Points.isOrigin(p)) {
      minDistance = Math.min(minDistance, Points.manhattanDistance(p));
    }
  }

  return minDistance.toString();
}

assertEquals(solve(parse([
  'R75,D30,R83,U83,L12,D49,R71,U7,L72',
  'U62,R66,U55,R34,D71,R55,D58,R83'
])), '159');

assertEquals(solve(parse([
  'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
  'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
])), '135');

console.log(solve(parse(readFile(__dirname))));