import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Point = {
  x: number,
  y: number;
  z: number
}

type Input = {
  values: Set<string>,
  w: number,
  h: number
};

const enc = (p: Point): string => `${p.x}_${p.y}_${p.z}`;

export const parse = (input: string[]): Input => {
  const d: Set<string> = new Set();
  for (let row = 0; row < input.length; row++) {
    input[row].split('').forEach((el, idx) => {
      if (el === '#') d.add(enc({ x: idx, y: row, z: 0 }));
    })
  }
  return { values: d, w: input[0].split('').length, h: input.length };
}

let ort = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
ort = cartesianProduct([-1, 0, 1], [-1, 0, 1], [-1, 0, 1]).filter(a => !(a[0] === 0 && a[1] === 0 && a[2] === 0));

export const solve = (input: Input): number => {
  let xDim = [0, input.w];
  let yDim = [0, input.h];
  let zDim = [0, 0];
  let s = new Set(input.values);
  for (let i = 0; i < 6; i++) {
    let d: Set<string> = new Set();
    xDim = [xDim[0] - 1, xDim[1] + 1];
    yDim = [yDim[0] - 1, yDim[1] + 1];
    zDim = [zDim[0] - 1, zDim[1] + 1];

    for (let x = xDim[0]; x <= xDim[1]; x++) {
      for (let y = yDim[0]; y <= yDim[1]; y++) {
        for (let z = zDim[0]; z <= zDim[1]; z++) {
          const p = enc({x, y, z});

          let activeNeighbours = ort.map(([xd, yd, zd]) => enc({ x: x + xd, y: y + yd, z: z + zd})).filter(p => s.has(p));

          /*
          if (z == 0) {
            console.log(p, s.has(p), activeNeighbours.length);
          }*/

          if (s.has(p)) {
            if (activeNeighbours.length === 2 || activeNeighbours.length === 3) {
              d.add(p);
            }
          } else {
            if (activeNeighbours.length === 3) {
              d.add(p);
            }
          }
        }   
      }  
    }

    /*
    for (let y = 0; y <= yDim[1]; y++) {
      let r = '';
      for (let x = 0; x <= xDim[1]; x++) {
        r += d.has(enc({ x, y, z: 0})) ? '#' : '.';
      }
      console.log(r);
    }*/

    s = d;
  }

  return s.size;
}

console.log(solve(parse(`.#.
..#
###`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));