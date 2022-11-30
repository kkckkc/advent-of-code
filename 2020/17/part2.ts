import { readFile } from '../../lib/readFile';
import { cartesianProduct } from '../../lib/combinatorics';

type Point = {
  x: number,
  y: number;
  z: number,
  w: number
}

type Input = {
  values: Set<string>,
  w: number,
  h: number
};

const enc = (p: Point): string => `${p.x}_${p.y}_${p.z}_${p.w}`;

export const parse = (input: string[]): Input => {
  const d: Set<string> = new Set();
  for (let row = 0; row < input.length; row++) {
    input[row].split('').forEach((el, idx) => {
      if (el === '#') d.add(enc({ x: idx, y: row, z: 0, w: 0 }));
    })
  }
  return { values: d, w: input[0].split('').length, h: input.length };
}

let ort = cartesianProduct([-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1]).filter(a => !a.every(k => k === 0));

export const solve = (input: Input): number => {
  let xDim = input.w;
  let yDim = input.h;
  let zDim = 0;
  let wDim = 0;

  let s = new Set(input.values);
  for (let i = 0; i < 6; i++) {
    let d: Set<string> = new Set();
    xDim++; yDim++; zDim++; wDim++;

    for (let x = -i-1; x <= xDim; x++) {
      for (let y = -i-1; y <= yDim; y++) {
        for (let z = -i-1; z <= zDim; z++) {
          for (let w = -i-1; w <= wDim; w++) {
            
            let activeNeighbours = 0;
            outer:
              for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                  for (let dz = -1; dz <= 1; dz++) {
                    for (let dw = -1; dw <= 1; dw++) {
                      if (dx == 0 && dy == 0 && dz == 0 && dw == 0) {
                        continue;
                      }

                      if (s.has(enc({ x: x + dx, y: y + dy, z: z + dz, w: w + dw}))) {
                        activeNeighbours++;
                      }

                      if (activeNeighbours > 3) break outer;
                    }
                  }
                }
              }

//            const activeNeighbours = ort.filter(([xd, yd, zd, wd]) => s.has(enc({ x: x + xd, y: y + yd, z: z + zd, w: w + wd}))).length;

            if (activeNeighbours === 3 || (s.has(enc({x, y, z, w})) && activeNeighbours === 2)) {
              d.add(enc({x, y, z, w}));
            }
          }
        }   
      }  
    }

    s = d;
  }

  return s.size;
}

console.log(solve(parse(`.#.
..#
###`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));