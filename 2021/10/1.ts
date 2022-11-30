import {readFile} from "../../lib/readFile";

type Input = string[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split(''));
}

const m: Record<string, string> = {
    '}': '{',
    ')': '(',
    ']': '[',
    '>': '<'
}

const points: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

export const solve = (input: Input): number => {
    let s = 0;
    for (const r of input) {
        let st: string[] = [];
        for (const c of r) {
            if (m[c]) {
                const current = st.pop();
                if (m[c] !== current) {
                    s += points[c];
                    break;
                }
            } else {
                st.push(c);
            }
        }
    }
    return s;
}

console.log(solve(parse(`[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));