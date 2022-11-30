type Input = { xs: number, xe: number, ys: number, ye: number };

const simulate = (dx: number, dy: number, input: Input): boolean => {
  let x = 0, y = 0;
  while (x < input.xe && y > input.ye) {
    x += Math.max(0, (dx--));
    y += (dy--);

    if (x >= input.xs && x <= input.xe && y <= input.ys && y >= input.ye) return true;
  }
  return false;
}

export const solve = (input: Input): number => {
  let minX = 1, maxX = input.xe;
  let minY = input.ye, maxY = Math.abs(input.ye);

  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (simulate(x, y, input)) count++;
    }
  }

  return count;
}

console.log(solve({ xs: 20, xe: 30, ys: -5, ye: -10 }))
console.log(solve({ xs: 96, xe: 125, ys: -98, ye: -144 }));