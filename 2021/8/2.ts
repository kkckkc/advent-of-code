import {readFile} from "../../lib/readFile";

type Input = {
    input: string[],
    output: string[]
}[];

export const parse = (input: string[]): Input => {
    return input.map(r => ({
        input: r.split('|')[0].split(' ').filter(e => e.length > 0).map(e => e.split('').sort().join('')),
        output: r.split('|')[1].split(' ').filter(e => e.length > 0).map(e => e.split('').sort().join(''))
    }))
}

const deduceWiring = (arr: string[]) => {
    const d1 = arr.find(e => e.length === 2)!;
    const d4 = arr.find(e => e.length === 4)!;
    const d7 = arr.find(e => e.length === 3)!;
    const d8 = arr.find(e => e.length === 7)!;

    const d9 = arr.find(e => e.length === 6 && d4.split('').every(k => e.includes(k)))!;
    const d0 = arr.find(e => e.length === 6 && e !== d9 && d1.split('').every(k => e.includes(k)))!;
    const d6 = arr.find(e => e.length === 6 && e !== d9 && e !== d0)!;

    const d3 = arr.find(e => e.length === 5 && d1.split('').every(k => e.includes(k)))!;
    const d5 = arr.find(e => e.length === 5 && e !== d3 && d4.split('').filter(k => e.includes(k)).length === 3)!;
    const d2 = arr.find(e => e.length === 5 && e !== d5 && e !== d3)!;

    return [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];
}

export const solve = (input: Input): number => {
    return input.map(a => {
        const wiring = deduceWiring(a.input);
        return Number(a.output.map(k => wiring.findIndex(q => q == k)).join(''))
    })
        .reduce((p, c) => p + c, 0);
}

console.log(solve(parse(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));