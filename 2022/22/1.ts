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
  const { board, instructions } = input;
  let w = board[0].length;
  let h = board.length;
  let row = 0;
  let col = board[0].findIndex((e) => e === ".");
  let dir = "R";

  //  console.log(instructions);
  for (let ins of instructions) {
    if (ins === "L" || ins === "R") {
      dir = TURN[dir][ins === "L" ? 0 : 1];
      //      console.log('New direction', dir)
    } else {
      for (let i = 0; i < ins; i++) {
        let nextCol = col + DIR[dir][0];
        let nextRow = row + DIR[dir][1];

        if (
          DIR[dir][0] !== 0 &&
          (nextCol < 0 || nextCol >= w || board[nextRow][nextCol] === " ")
        ) {
          let c = col;
          if (dir === "R") {
            while (c > 0 && board[row][c - 1] !== " ") c--;
          } else if (dir === "L") {
            while (c < w - 1 && board[row][c + 1] !== " ") c++;
          } else throw new Error(`Unexpted direction ${dir}`);
          nextCol = c;
        }

        if (
          DIR[dir][1] !== 0 &&
          (nextRow < 0 || nextRow >= h || board[nextRow][nextCol] === " ")
        ) {
          let r = row;
          if (dir === "D") {
            while (r > 0 && board[r - 1][col] !== " ") r--;
          } else if (dir === "U") {
            while (r < h - 1 && board[r + 1][col] !== " ") r++;
          } else throw new Error(`Unexpted direction ${dir}`);
          nextRow = r;
        }

        if (board[nextRow][nextCol] === "#") break;

        board[row][col] = dir;

        col = nextCol;
        row = nextRow;
      }

      board[row][col] = "*";

      //      console.log(board.map(r => r.join('')).join('\n'))
    }
  }

  // console.log(board.map(r => r.join('')).join('\n'))

  //  console.log(row, col, dir);
  return (row + 1) * 1000 + (col + 1) * 4 + DIR_SCORE[dir];
};

console.log(solve(parse(readFile(__dirname, "test.txt"))));

console.log(solve(parse(readFile(__dirname))));
