import {readFile} from "../../lib/readFile";

type Input = {
    values: number[][]
};

export const parse = (input: string[]): Input => {
    return { values: input.map(i => i.split('').map(a => Number(a))) };
}

export const solve = (input: Input): string => {
    const sum = input.values.reduce((c, p) => c.map((a, i) => a + p[i]), input.values[0].map(_ => 0));
    const len = input.values.length;

    const gamma = sum.map(a => a > (len / 2) ? '1' : '0').join('');
    const epsilon = sum.map(a => a < (len / 2) ? '1' : '0').join('');

    return (Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2)).toString();
}

console.log(solve(parse(readFile(__dirname))));