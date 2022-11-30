import {readFile} from "../../lib/readFile";

type Input = number[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split('').map(a => Number(a)));
}

const adjacent = (arr: number[][], r: number, c: number) => {
    return [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
        .map(([dx, dy]) => [r + dy, c + dx])
        .filter(([dy, dx]) => dx >= 0 && dx < arr[0].length && dy >= 0 && dy < arr.length);
}

export const solve = (input: Input): number => {
    let flashes = 0;

    for (let i = 0; i < 100000; i++) {
        const flashed: number[][] = [];

        for (let r = 0; r < input.length; r++) {
            for (let c = 0; c < input[r].length; c++) {
                input[r][c]++;
                if (input[r][c] > 9) {
                    flashed.push([r, c]);
                }
            }
        }

        while (flashed.length > 0) {
            const [r, c] = flashed.pop()!;
            flashes++;

            for (const [r1, c1] of adjacent(input, r, c)) {
                if (input[r1][c1] <= 9) {
                    input[r1][c1]++;
                    if (input[r1][c1] > 9) {
                        flashed.push([r1, c1]);
                    }
                }
            }
        }

        let reset = 0;
        for (let r = 0; r < input.length; r++) {
            for (let c = 0; c < input[r].length; c++) {
                if (input[r][c] > 9) {
                    input[r][c] = 0;
                    reset++;
                }
            }
        }

        if (reset === 100) return i;
    }

    return flashes;
}

console.log(solve(parse(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));