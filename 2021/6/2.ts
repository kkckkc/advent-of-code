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
    let buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    input.numbers.forEach(a => buckets[a]++);

    for (let i = 0; i < 256; i++) {
        let zeros = buckets[0];
        buckets = buckets.slice(1);
        buckets[6] += zeros;
        buckets.push(zeros);
    }

    return buckets.reduce((p, c) => p + c, 0);
}

console.log(solve(parse(`3,4,3,1,2`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));