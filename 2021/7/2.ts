import {readFile} from "../../lib/readFile";

type Input = {
    numbers: number[]
};

export const parse = (input: string[]): Input => {
    return {
        numbers: input[0].split(',').map(a => Number(a))
    };
}

export const solve = (input: Input): number => {
    let min = input.numbers.reduce((p, c) => Math.min(p, c), Number.MAX_SAFE_INTEGER);
    let max = input.numbers.reduce((p, c) => Math.max(p, c), 0);

    const triangular = (n: number) => n * (n + 1) / 2;

    let minFound = Number.MAX_SAFE_INTEGER;
    for (let i = min; i < max; i++) {
        let sum = input.numbers.reduce((r, c) => r + triangular(Math.abs(c - i)), 0);
        if (sum < minFound) {
            minFound = sum;
        }
    }
    return minFound;
}

console.log(solve(parse(`16,1,2,0,4,2,7,1,2,14`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));