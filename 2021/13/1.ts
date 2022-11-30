import {readFile} from "../../lib/readFile";

type Input = {
    coords: number[][];
    folds: {
        axis: 'x' | 'y',
        offset: number
    }[]
};

export const parse = (input: string[]): Input => {
    const coords: any[] = [];
    const folds: any[] = [];

    let coordsRead = false;
    for (const s of input) {
        if (s.trim() === '') coordsRead = true;
        else if (! coordsRead) {
            coords.push(s.split(',').map(a => Number(a)))
        } else {
            folds.push({
                axis: s.split('=')[0].endsWith('x') ? 'x' : 'y',
                offset: Number(s.split('=')[1])
            })
        }
    }
    return {
        coords, folds
    }
}

const unique = (coords: number[][]): number[][] => {
    return [...new Set(coords.map(([x, y]) => `${x},${y}`))].map(a => a.split(',').map(b => Number(b)));
}

const fold = (coords: number[][], { axis, offset }: { axis: 'x' | 'y', offset: number }) => {
    if (axis === 'y') {
        return unique(coords.map(([x, y]) => y < offset ? [x, y] : [x, offset - (y - offset)]))
    } else {
        return unique(coords.map(([x, y]) => x < offset ? [x, y] : [offset - (x - offset), y]))
    }
}

export const solve = (input: Input): number => {
    const coords = input.coords;
    let newCoords = fold(coords, input.folds[0]);
    return newCoords.length;
}

console.log(solve(parse(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));