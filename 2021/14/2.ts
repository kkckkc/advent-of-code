import {readFile} from "../../lib/readFile";

type Input = {
    start: string;
    transforms: Record<string, string>;
};

type PairCount = Record<string, Record<string, number>>;

export const parse = (input: string[]): Input => {
    return {
        start: input[0],
        transforms: Object.fromEntries(input.slice(2).map(a => a.split(' -> ')))
    }
}

const add = (dest: Record<string, number>, src: Record<string, number>) => {
    Object.entries(src).forEach(([k, v]) => dest[k] = (dest[k] ?? 0) + v);
}

export const solve = (input: Input): number => {
    const counts: PairCount[] = [];

    for (let i = 0; i < 40; i++) {
        const curr: PairCount = {};
        counts.push(curr);

        for (const [pair, insert] of Object.entries(input.transforms)) {
            curr[pair] ={};

            if (i > 0) {
                add(curr[pair], counts[i - 1][pair[0] + insert]);
                add(curr[pair], counts[i - 1][insert + pair[1]]);
                curr[pair][insert] = curr[pair][insert] - 1;
            } else {
                curr[pair][pair[0]] = 1;
                curr[pair][pair[1]] = (curr[pair][pair[1]] ?? 0) + 1;
                curr[pair][insert] = (curr[pair][insert] ?? 0) + 1;
            }
        }
    }

    const d: Record<string, number> = {};
    for (let i = 0; i < input.start.length - 1; i++) {
        const p = input.start[i] + input.start[i + 1];
        add(d, counts[counts.length - 1][p]);
        if (i !== input.start.length - 2) d[input.start[i + 1]]--;
    }

    let min = Object.entries(d).reduce((p, c) => Math.min(p, c[1]), Number.MAX_SAFE_INTEGER);
    let max = Object.entries(d).reduce((p, c) => Math.max(p, c[1]), 0);

    return max - min;
}

console.log(solve(parse(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));