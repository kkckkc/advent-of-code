import {readFile} from "../../lib/readFile";

type Input = number[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split('').map(a => Number(a)));
}

const adjacent = (arr:number[][], r: number, c: number) => {
    const dest = [];
    if (r > 0) dest.push([arr[r - 1][c], r - 1, c]);
    if (c > 0) dest.push([arr[r][c - 1], r, c - 1]);
    if (r < (arr.length - 1)) dest.push([arr[r + 1][c], r + 1, c]);
    if (c < (arr[r].length - 1)) dest.push([arr[r][c + 1], r, c + 1]);
    return dest;
}

export const solve = (input: Input): number => {
    let basins: number[] = [];
    for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[r].length; c++) {
            if (adjacent(input, r, c).map(a => a[0]).every(k => k > input[r][c])) {
                let basin: number[][] = [[r, c]];
                let q = adjacent(input, r, c).filter(([a]) => a !== 9);
                while (q.length > 0) {
                    const [current, cr, cc] = q.pop()!;
                    if (! basin.find(([a, b]) => a == cr && b == cc)) basin.push([cr, cc]);
                    adjacent(input, cr, cc).filter(([a]) => a > current && a !== 9).forEach(a => q.push(a));
                }
                basins.push(basin.length)
            }
        }
    }

    basins.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
    return basins[0] * basins[1] * basins[2];
}

console.log(solve(parse(`2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));