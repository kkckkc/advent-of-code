import {readFile} from "../../lib/readFile";

type Input = number[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split('').map(a => Number(a)));
}

const adjacent = (arr:number[][], r: number, c: number) => {
    const dest = [];
    if (r > 0) dest.push(arr[r - 1][c]);
    if (c > 0) dest.push(arr[r][c - 1]);
    if (r < (arr.length - 1)) dest.push(arr[r + 1][c]);
    if (c < (arr[r].length - 1)) dest.push(arr[r][c + 1]);
    return dest;
}

export const solve = (input: Input): number => {
    let s = 0;
    for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[r].length; c++) {
            if (adjacent(input, r, c).every(k => k > input[r][c])) {
                s += input[r][c] + 1;
            }
        }
    }
    return s;
}

console.log(solve(parse(`2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));