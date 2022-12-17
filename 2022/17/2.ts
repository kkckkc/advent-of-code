import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { range } from 'lib/arrays';
applyPatches();

type Input = {
  values: string[];
};

export const parse = (input: string[]): Input => {
  return { values: input[0].split('') };
};

const SHAPES = [
  [
    '@@@@'.split(''),
    '    '.split(''),
    '    '.split(''),
    '    '.split(''),
  ],
  [
    ' @  '.split(''),
    '@@@ '.split(''),
    ' @  '.split(''),
    '    '.split('')
  ],
  [
    '@@@ '.split(''),
    '  @ '.split(''),
    '  @ '.split(''),
    '    '.split('')
  ],
  [
    '@   '.split(''),
    '@   '.split(''),
    '@   '.split(''),
    '@   '.split('')
  ],
  [
    '@@  '.split(''),
    '@@  '.split(''),
    '    '.split(''),
    '    '.split(''),
  ]
]

const SHAPE_HEIGHT = [1, 3, 3, 4, 2];
const SHAPE_OFFSET_X = [0, 1, 1, 3, 2];

const canMoveTo = (x: number, y: number, shapeNumber: number, rows: string[][], shapePositions: number[][][]) => {
  if (x < 0) { return false; }
  if (x + 4 - SHAPE_OFFSET_X[shapeNumber] > 7) { return false; }
  if (y < 0) { return false; }

  return !shapePositions[shapeNumber]
    .find(([xo, yo]) => {
      return rows[y + yo]?.[x + xo] === '#'
    });
}

const printBoard = (rows: string[][], x?: number, y?: number, shape?: string[][]) => {
  return;
  console.log('');
  for (let i = rows.length - 1; i >= 0; i--) {
    let r: string[] = [];
    for (let j = 0; j < rows[i].length; j++) {
      if (shape) {
        let xo = j - x;
        let yo = i - y;
        if (xo >= 0 && xo < 4 && yo >= 0 && yo < 4 && shape[yo][xo] === '@') {
          r.push('@');
        } else {
          r.push(rows[i][j]);
        }
      } else {
        r.push(rows[i][j]);
      }
    }
    console.log(`|${r.join('')}|`);
  }
  console.log('+-------+');
}

export const solve = (input: Input, len=undefined): number => {
  let rows: string[][] = []; // = range(1, 3).map(() => '       '.split(''));

  const shapePositions: number[][][] = [];
  for (let i = 0; i < SHAPES.length; i++) {
    const d: number[][] = [];
    for (let xo = 0; xo < 4; xo++) {
      for (let yo = 0; yo < 4; yo++) {
        if (SHAPES[i][yo][xo] === '@') {
          d.push([xo, yo])
        }
      }
    }
    shapePositions.push(d);
  }

  let arr: number[][] = [];
  let idx = 0;
  let prev = 0;
  let prevC = 0;
  for (let i = 0; i < (len ?? 50000); i++) {
    let emptyRows = 0;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].every(c => c === ' ')) emptyRows++;
      else break;
    }
    const newRows = 3 + SHAPE_HEIGHT[i % SHAPES.length] - emptyRows;
//    console.log(`New shape ${i}`, emptyRows, newRows)
    if (newRows > 0)
      range(1, 3 + SHAPE_HEIGHT[i % SHAPES.length] - emptyRows).forEach(() => rows.push('       '.split('')))
    else if (newRows < 0) {
      for (let i = 0; i < Math.abs(newRows); i++) rows.pop()
    }

    let x = 2;
    let y = rows.length - SHAPE_HEIGHT[i % SHAPES.length];

    printBoard(rows, x, y, SHAPES[i % SHAPES.length]);

    while (true) {

      // Shift direction
      let dir = input.values[idx++ % input.values.length];

      let newPos = dir === '<' ? x - 1 : x + 1;
      if (canMoveTo(newPos, y, i % SHAPES.length, rows, shapePositions)) {
//        console.log(`${dir} ok`, y);
        x = newPos;
      } else {
//        console.log(`${dir} block`, y);
      }
      printBoard(rows, x, y, SHAPES[i % SHAPES.length]);

      const canMoveDown = canMoveTo(x, y - 1, i % SHAPES.length, rows, shapePositions);
      if (canMoveDown) {
//        console.log('Fall')
        y--;
        printBoard(rows, x, y, SHAPES[i % SHAPES.length]);
      }
      else {
//        console.log('Fall stop')
        shapePositions[i % SHAPES.length].forEach(([xo, yo]) => rows[y + yo][x + xo] = '#');
        printBoard(rows);
        break;
      }

      if (!len && (idx - 1) % input.values.length === 0) {
        arr.push([i - prevC, rows.filter(r => !r.every(c => c === ' ')).length - prev, i]);
        prev = rows.filter(r => !r.every(c => c === ' ')).length;
        prevC = i;
  //      for (let k = rows.length - 1; k >= Math.max(rows.length - 10, 0); k--) {
  //        if (!rows[k].every(c => c === ' ')) {
  //          console.log(rows[k].map(c => c === ' ' ? '.' : c).join(''))
  //          break;
  //        }
  //      }
      }
    }

  }

  if (!len) {
    console.log(arr);
/*outer:
    for (let offset = 0; offset < 20; offset++) {
      nextLen:
      for (let d = 1; d < 30; d++) {
        let b = arr[offset];
        for (let i = offset + d; i += d; i < arr.length) {
          if (arr[i] === undefined) break;
          if (arr[i] !== b) continue nextLen;
        }
        console.log(offset, d);
//        break outer;
      }
    }*/
  }

  return rows.filter(r => !r.every(c => c === ' ')).length;
};

//console.log(solve(parse(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'))));

const calculate = (d: string[], o: number, c: number, mult?: number) => {
  const il = mult ?? parse(d).values.length;

  console.log('====')
  
  const offset = solve(parse(d), il * o);
  console.log(il * o, offset)

  const cycleHeight = solve(parse(d), il * (o + c)) - offset;

  const numberOfCycles = Math.floor((1000000000000 - il * o) / (il * c));
  const remaining = (1000000000000 - il * o) % (il * c);

  console.log('--->');
  console.log(il,
    offset, cycleHeight, numberOfCycles, remaining, solve(parse(d), il * o + remaining)
  );
  const r = offset + numberOfCycles * cycleHeight + 
    solve(parse(d), il * o + remaining) - offset;
  return r;
}

//console.log(solve(parse(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'))));


// 4 7
console.log(calculate(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'), 1, 7));
console.log(calculate(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'), 150, 35, 1));
console.log(calculate(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'), 450, 35, 1));

console.log('**********')
console.log(solve(parse(readFile(__dirname))));

console.log('---')
console.log(1723, solve(parse(readFile(__dirname)), 1723));
console.log(1723+1705, solve(parse(readFile(__dirname)), 1723+1705));

console.log(calculate(readFile(__dirname), 1723, 1705, 1));
console.log(calculate(readFile(__dirname), 1724, 1705, 1));
//console.log(calculate(parse(readFile(__dirname)).values, 21000, 1705, 1));
//console.log(calculate(parse(readFile(__dirname)).values, 21000, 1705, 1));
// 19 offset
// 27 length
//calculate(readFile(__dirname), 1, 2);
/*for (let j = 1; j < 500; j++) {
  console.log(j);
  let res = calculate(readFile(__dirname), 5, j);
  let matches = true;
  for (let i = 5 ; i < 10; i++) {
    const r = calculate(readFile(__dirname), i, j);
    matches = matches && res === r;
    console.log(r);
  }
  if (matches) console.log('--------------------->');
}*/
  // 50 + 31 * x
  // 51 + 31 * x
  // 50 + 51 * x
  // 51 + 51 * x
  // 64
//}
/*
const inputLength = parse(readFile(__dirname)).values.length;
const offset2 = solve(parse(readFile(__dirname)), 19 * inputLength);
const cycleHeight2 = solve(parse(readFile(__dirname)), (19 + 27) * inputLength) - offset2;
const numberOfCycles2 = Math.floor((1000000000000 - 19 * inputLength) / ((27 + 19) * inputLength - 19 * inputLength));
const remaining2 = (1000000000000 - 19 * inputLength) % ((27 + 19) * inputLength - 19 * inputLength);
console.log(
  offset2, cycleHeight2, numberOfCycles2, remaining2
);
console.log(offset2 + numberOfCycles2 * cycleHeight2 + 
  solve(parse(readFile(__dirname)), 19 * inputLength + remaining2) - offset2
)

*/



// console.log(solve(parse(readFile(__dirname))));


