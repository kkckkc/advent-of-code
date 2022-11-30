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
const M: Record<string, string> = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'
}

const points: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

export const solve = (input: Input): number => {
    let s: number[] = [];
outer:
    for (const r of input) {
        let st: string[] = [];
        for (const c of r) {
            if (m[c]) {
                const current = st.pop();
                if (m[c] !== current) {
                    continue outer;
                }
            } else {
                st.push(c);
            }
        }

        let v = 0
        while (st.length > 0) {
            const c = st.pop()!;
            v = 5 * v + points[M[c]];
        }
        s.push(v);
    }

    s.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    return s[Math.floor(s.length / 2)];
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