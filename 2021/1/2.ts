import {readFile} from "../../lib/readFile";

type Input = {
    values: number[]
};

export const parse = (input: string[]): Input => {
    return { values: input.map(i => Number.parseInt(i)) };
}

export const solve = (input: Input): string => {
    return (input.values
        .map((a, idx, arr) => idx >= 2 ? arr[idx - 2] + arr[idx - 1] + a : 0)
        .filter((n, idx, arr) => idx > 0 && n > arr[idx - 1])
        .length - 1).toString();
}

console.log(solve(parse(readFile(__dirname))));