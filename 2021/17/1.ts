import {readFile} from "../../lib/readFile";

type Input = {
  xs: number,
  xe: number,
  ys: number,
  ye: number
};

const simulate = (dx: number, dy: number, ddx: number, ddy: number, input: Input): number => {
  let x = 0, y = 0, maxY = 0;
  while (x < input.xe && y > input.ye) {
    x += Math.max(0, dx);
    y += dy;
    //console.log(x, y);
    maxY = Math.max(maxY, y);
    dx += ddx;
    dy += ddy;

    if (x >= input.xs && x <= input.xe && y <= input.ys && y >= input.ye) return maxY;
    if (ddy === 0 && dx <= 0) break;
    //if (ddx === 0 && dy <= 0) break;
  }
  return -1000;
}

export const solve = (input: Input): number => {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;

  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  for (let sdx = 1; sdx < input.xe; sdx++) {
    if (simulate(sdx, 0, -1, 0, { ...input, ys: 0, ye: Number.MIN_SAFE_INTEGER }) !== -1000) {
      minX = Math.min(minX, sdx);
      maxX = Math.max(maxX, sdx);
    }
  }

  for (let sdy = input.ye; sdy < 2*maxX; sdy++) {
    if (simulate(0, sdy, 0, -1, { ...input, xs: 0, xe: Number.MAX_SAFE_INTEGER }) !== -1000) {
      minY = Math.min(minY, sdy);
      maxY = Math.max(maxY, sdy);
    }
  }

  let maxHeight = 0;
  for (let x = minX-1; x <= maxX+1; x++) {
    for (let y = minY-1; y <= maxY; y++) {
      maxHeight = Math.max(maxHeight, simulate(x, y, -1, -1, input));
    }
  }

  console.log(minX, maxX, minY, maxY);
  //console.log(simulate(6, 3, -1, -1, input));

  return maxHeight;
}

console.log(solve({ xs: 20, xe: 30, ys: -5, ye: -10 }))
console.log(solve({ xs: 96, xe: 125, ys: -98, ye: -144 }));