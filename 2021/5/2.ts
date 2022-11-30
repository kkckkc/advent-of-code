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
        if (line.x1 === line.x2) {
            for (let a = Math.min(line.y1, line.y2); a <= Math.max(line.y1, line.y2); a++) {
                points[`${line.x1},${a}`] = (points[`${line.x1},${a}`] ?? 0) + 1;
            }
        } else if (line.y1 === line.y2) {
            for (let a = Math.min(line.x1, line.x2); a <= Math.max(line.x1, line.x2); a++) {
                points[`${a},${line.y1}`] = (points[`${a},${line.y1}`] ?? 0) + 1;
            }
        } else {
            const l = Math.abs(line.x1 - line.x2);

            let p1 = { x: line.x1, y: line.y1 };
            let p2 = { x: line.x2, y: line.y2 };

            if (p2.x < p1.x) [p2, p1] = [p1, p2];

            const dx = 1;
            const dy = (p2.y < p1.y) ? -1 : 1;

            for (let d = 0; d <= l; d++) {
                points[`${p1.x},${p1.y}`] = (points[`${p1.x},${p1.y}`] ?? 0) + 1;
                p1.x += dx;
                p1.y += dy;
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