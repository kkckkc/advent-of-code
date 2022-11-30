import {readFile} from "../../lib/readFile";

type Input = {
    values: { dir: string, amount: number }[]
};

export const parse = (input: string[]): Input => {
    return { values: input.map(i => ({ dir: i.split(' ')[0], amount: Number(i.split(' ')[1]) })) };
}

export const solve = (input: Input): string => {
    let h = 0, d = 0;
    for (const { dir, amount } of input.values) {
        if (dir === 'forward') h += amount;
        if (dir === 'up') d -= amount;
        if (dir === 'down') d += amount;
    }
    return (h * d).toString();
}

console.log(solve(parse(readFile(__dirname))));