import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { fill, range } from "lib/arrays";
applyPatches();

type Input = {
  board: string[][];
  instructions: (number | string)[];
};

export const parse = (input: string[]): Input => {
  const [board, instructions] = input.splitOn((e) => e === "");
  const arr = instructions[0].split(/([0-9]+)/).filter((e) => e !== "");

  let w = board.map((a) => a.length).max();
  return {
    board: board
      .map((a) => (a.length < w ? a + fill(w - a.length, " ").join("") : a))
      .map((a) => a.split("")),
    instructions: arr,
  };
};

let TURN = {
  L: ["D", "U"],
  D: ["R", "L"],
  R: ["U", "D"],
  U: ["L", "R"],
};

let DIR = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
  D: [0, 1],
};

let DIR_SCORE = {
  R: 0,
  D: 1,
  L: 2,
  U: 3,
};

export const solve = (input: Input): number => {
  let { board, instructions } = input;
  let cubeWidth = board.map(l => l.filter(e => e !== ' ').length).min();
  let w = board[0].length;
  let h = board.length;
  let row = 1;
  let col = board[0].findIndex((e) => e === ".") + 1;
  let dir = "R";
/*
  instructions = ['2']
  dir = 'R'
  row = 11;
  col = 3;
  board[row - 1][col - 1] = dir
*/
  //  console.log(instructions);
  for (let ins of instructions) {
    if (ins === "L" || ins === "R") {
      const oldDir = dir;
      dir = TURN[dir][ins === "L" ? 0 : 1];
//      console.log(oldDir, ' turn', ins, ' -> new direction', dir)
    } else {
      for (let i = 0; i < ins; i++) {
        let nextCol = col + DIR[dir][0];
        let nextRow = row + DIR[dir][1];
        let nextDir = dir;

        let side = undefined;
        if (row <= cubeWidth) {
          if (col <= 2 * cubeWidth) side = 1;
          else side = 2;
        }
        else if (row <= (2 * cubeWidth)) {
          side = 3;
        } else if (row <= (3 * cubeWidth)) {
          if (col <= cubeWidth) side = 4;
          else side = 5;
        }
        else side = 6;


        if (nextCol < 1 || nextCol > w || nextRow < 1 || nextRow > h || board[nextRow - 1][nextCol - 1] === " ") {
          if (side === 1) {
            if (dir === 'U') {
              nextRow = 3 * cubeWidth + (col - cubeWidth);
              nextCol = 1;
              nextDir = 'R';
            } else if (dir === 'L') {
              nextRow = 3 * cubeWidth - row + 1;
              nextCol = 1;
              nextDir = 'R'
            }
          } else if (side === 2) {
            if (dir === 'U') {
              nextDir = 'U';
              nextRow = 4 * cubeWidth;
              nextCol = col - 2 * cubeWidth;
            } else if (dir === 'R') {
              nextDir = 'L'
              nextRow = 3 * cubeWidth + 1 - row;
              nextCol = 2 * cubeWidth;
            } else if (dir === 'D') {
              nextDir = 'L'
              nextRow = cubeWidth + (col - 2 * cubeWidth);
              nextCol = 2 * cubeWidth;
            }
          } else if (side === 3) {
            if (dir === 'L') {
              nextDir = 'D'
              nextCol = row - cubeWidth;
              nextRow = 2 * cubeWidth + 1;
            } else if (dir === 'R') {
              nextDir = 'U'
              nextCol = 2 * cubeWidth + (row - cubeWidth);
              nextRow = cubeWidth;
            }
          } else if (side === 4) {
            if (dir === 'U') {
              nextDir = 'R'
              nextRow = cubeWidth + col;
              nextCol = cubeWidth + 1;
            } else if (dir === 'L') {
              nextDir = 'R'
              nextRow = cubeWidth + 1 - (row - 2 * cubeWidth)
              nextCol = cubeWidth + 1
            }
          } else if (side === 5) {
            if (dir === 'R') {
              nextDir = 'L'
              nextRow = 3 * cubeWidth + 1 - row;
              nextCol = 3 * cubeWidth
            } else if (dir === 'D') {
              nextDir = 'L'
              nextRow = 3 * cubeWidth + (col - cubeWidth);
              nextCol = cubeWidth;
            }
          } else if (side === 6) {
            if (dir === 'L') {
              nextDir = 'D'
              nextCol = (row - 3 * cubeWidth) + cubeWidth;
              nextRow = 1;
            } else if (dir === 'D') {
              nextDir = 'D'
              nextCol = 2 * cubeWidth + col;
              nextRow = 1;
            } else if (dir === 'R') {
              nextDir = 'U'
              nextCol = cubeWidth + (row - 3 * cubeWidth);
              nextRow = 3 * cubeWidth;
            }
          }
        }


        if (board[nextRow - 1][nextCol - 1] === "#") {
//          board[nextRow - 1][nextCol - 1] = '?'
          break;
        }

        board[row - 1][col - 1] = dir;

        dir = nextDir;
        col = nextCol;
        row = nextRow;

        board[row - 1][col - 1] = dir;
      }

//      board[row - 1][col - 1] = "*";
    }
  }

  // console.log(board.map(r => r.join('')).join('\n'))

  //  console.log(row, col, dir);
  return (row) * 1000 + (col) * 4 + DIR_SCORE[dir];
};

//console.log(solve(parse(readFile(__dirname, "test2.txt"))));

console.log(solve(parse(readFile(__dirname))));


