import {readFile} from "../../lib/readFile";

type Input = {
    lines: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }[]
};

export const parse = (input: string[]): Input => {
    return {
        lines: input.map(l => {
            const [f, t] = l.split('->');
            return {
                x1: Number(f.split(',')[0]),
                y1: Number(f.split(',')[1]),
                x2: Number(t.split(',')[0]),
                y2: Number(t.split(',')[1]),
            }
        })
    };
}

export const solve = (input: Input): string => {
    const points: Record<string, number> = {};

    for (const line of input.lines) {
        if (line.x1 !== line.x2 && line.y1 !== line.y2) continue;
        if (line.x1 === line.x2) {
            for (let a = Math.min(line.y1, line.y2); a <= Math.max(line.y1, line.y2); a++) {
                points[`${line.x1},${a}`] = (points[`${line.x1},${a}`] ?? 0) + 1;
            }
        } else {
            for (let a = Math.min(line.x1, line.x2); a <= Math.max(line.x1, line.x2); a++) {
                points[`${a},${line.y1}`] = (points[`${a},${line.y1}`] ?? 0) + 1;
            }
        }
    }

    return (Object.values(points).filter(v => v > 1).length).toString();
}

console.log(solve(parse(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));