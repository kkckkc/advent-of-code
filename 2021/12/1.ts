import {readFile} from "../../lib/readFile";

type Input = string[][];

export const parse = (input: string[]): Input => {
    return input.map(r => r.split('-'));
}

const pathsFrom = (start: string, adj: Record<string, string[]>, visited: Set<string>): number => {
    let newVisited = new Set(visited);
    if (start.toLowerCase() === start) {
        newVisited.add(start);
    }

    let outgoing = 0;
    for (const next of adj[start]) {
        if (next === 'end') {
            outgoing++;
        } else if (! newVisited.has(next)) {
            outgoing += pathsFrom(next, adj, newVisited);
        }
    }
    return outgoing;
}

export const solve = (input: Input): number => {
    const adj : Record<string, string[]> = {};
    for (const [a, b] of input) {
        adj[a] = [...(adj[a] ?? []), b];
        adj[b] = [...(adj[b] ?? []), a];
    }

    return pathsFrom('start', adj, new Set<string>());
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