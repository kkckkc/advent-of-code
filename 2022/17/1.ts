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

export const solve = (input: Input): number => {
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

  let idx = 0;
  for (let i = 0; i < 2022; i++) {
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
    }
  }

  return rows.filter(r => !r.every(c => c === ' ')).length;
};

console.log(solve(parse(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
