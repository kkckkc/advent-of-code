import { readFile } from '../../lib/readFile';
import { Points, Vectors } from 'lib/geometry';

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
  let waypoint = { x: 10, y: 1};

  for (const v of input.values) {
    switch (v.direction) {
      case 'F': 
        current = Points.addVector(current, { x: waypoint.x * v.len, y: waypoint.y * v.len });
        break;
      case 'N':
        waypoint = Points.addVector(waypoint, { x: 0, y: v.len });
        break;
      case 'S':
        waypoint = Points.addVector(waypoint, { x: 0, y: -v.len });
        break;
      case 'W':
        waypoint = Points.addVector(waypoint, { x: -v.len, y: 0 });
        break;
      case 'E':
        waypoint = Points.addVector(waypoint, { x: v.len, y: 0 });
        break;
      case 'L':
        waypoint = Vectors.round(Vectors.rotate(waypoint, v.len));
        break;
      case 'R':
        waypoint = Vectors.round(Vectors.rotate(waypoint, -v.len));
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