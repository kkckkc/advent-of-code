import { sum } from 'lib/arrays';
import {readFile} from "lib/readFile";

type Input = {
    values: number[][]
};

export const parse = (input: string[]): Input => {
    const values: number[][] = [[]];
    for (const s of input) {
        if (s === "") {
            values.push([]);
        } else {
            values.at(-1).push(Number(s));
        }
    }
    return { values };
}

export const solve = (input: Input): number => {
    const arr = input.values.map(e => sum(e)).sort((a, b) => a - b).reverse();
    return sum(arr.slice(0, 3));
}

console.log(solve(parse(readFile(__dirname))));