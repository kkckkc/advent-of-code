import {readFile} from "../../lib/readFile";

type Input = {
    values: number[][]
};

export const parse = (input: string[]): Input => {
    return { values: input.map(i => i.split('').map(a => Number(a))) };
}

export const solve = (input: Input): string => {
    let oxygen = [...input.values];
    let co2 = [...input.values];
    for (let i = 0; i < input.values[0].length; i++) {
        if (oxygen.length > 1) {
            let oc = oxygen.reduce((p, c) => p + c[i], 0) >= (oxygen.length / 2) ? 1 : 0;
            oxygen = oxygen.filter(c => c[i] === oc);
        }

        if (co2.length > 1) {
            let cc = co2.reduce((p, c) => p + c[i], 0) < (co2.length / 2) ? 1 : 0;
            co2 = co2.filter(c => c[i] === cc);
        }
    }

    return (Number.parseInt(oxygen[0].join(''), 2) * Number.parseInt(co2[0].join(''), 2)).toString();
}


console.log(solve(parse(readFile(__dirname))));