import {readFile} from "../../lib/readFile";

type Input = {
    boards: number[][][];
    callouts: number[];
};

export const parse = (input: string[]): Input => {
    const callouts: number[] = input[0].split(',').map(a => Number(a));

    const boards: number[][][] = [];

    for (let r of input.slice(1)) {
        if (r === '') boards.push([]);
        else {
            boards[boards.length - 1].push(r.split(' ').map(a => Number(a)));
        }
    }

    return { boards, callouts };
}

const isSolved = (board: number[][], numbers: Set<number>) => {
    for (let idx of [0, 1, 2, 3, 4]) {
        const row = board[idx];
        const col = board.map(r => r[idx]);
        if (row.every(a => numbers.has(a)) || col.every((a => numbers.has(a)))) return true;
    }
    return false;
}

export const solve = (input: Input): string => {
    const numbers = new Set<number>();
    let boards = [...input.boards];
    for (const n of input.callouts) {
        numbers.add(n);

        const winningBoards = boards.filter(b => isSolved(b, numbers));
        boards = boards.filter(b => !isSolved(b, numbers));

        if (boards.length === 0) {
            const winningBoard = winningBoards[winningBoards.length - 1];
            const sum = winningBoard.flatMap(r => r).filter(e => !numbers.has(e)).reduce((p, c) => p + c, 0);
            return (sum * n).toString();
        }
    }

    return '';
}

console.log(solve(parse(readFile(__dirname))));