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
    let coords = input.coords;

    for (const f of input.folds) {
        coords = fold(coords, f);
    }

    let minX = coords.reduce((p, [x]) => Math.min(p, x), 1000);
    let maxX = coords.reduce((p, [x]) => Math.max(p, x), 0);

    let minY = coords.reduce((p, [, y]) => Math.min(p, y), 1000);
    let maxY = coords.reduce((p, [, y]) => Math.max(p, y), 0);

    for (let y = minY; y <= maxY; y++) {
        let s = '';
        for (let x = minX; x <= maxX; x++) {
            if (coords.find(([x1, y1]) => x1 === x && y1 === y)) {
                s += '#';
            } else {
                s += ' ';
            }
        }
        console.log(s);
    }

    return 0;
}


console.log(solve(parse(readFile(__dirname))));