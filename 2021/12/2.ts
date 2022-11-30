import {readFile} from "../../lib/readFile";

type Input = string[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split('-'));
}

const pathsFrom = (start: string, adj: Record<string, string[]>, visited: Set<string>, usedTwice: boolean): number => {
    if (start === 'end') return 1;
    let outgoing = 0;

    for (const next of adj[start].filter(a => !visited.has(a))) {
        outgoing += pathsFrom(next, adj, next.toLowerCase() === next ? new Set([...visited, next]) : visited, usedTwice);
    }

    if (usedTwice) return outgoing;

    for (const next of adj[start].filter(a => visited.has(a)).filter(a => a !== 'start' && a !== 'end')) {
        outgoing += pathsFrom(next, adj, visited, true);
    }

    return outgoing;
}

export const solve = (input: Input): number => {
    const adj : Record<string, string[]> = {};
    for (const [a, b] of input) {
        adj[a] = [...(adj[a] ?? []), b];
        adj[b] = [...(adj[b] ?? []), a];
    }

    return pathsFrom('start', adj, new Set<string>(["start"]), false);
}

console.log(solve(parse(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`.split('\n'))))
console.log(solve(parse(`dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`.split('\n'))))
console.log(solve(parse(`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));