import { readFile } from '../../lib/readFile';
import { Edge, Graph, GraphFactory } from 'lib/graph';
import { Strings } from 'lib/strings';

type Input = {
  values: Edge[]
};

const parseLine = (s: string) => {
  return Strings.extract(s, /^(.*) bags contain ([0-9].*)\.$/, 
    ([from, to]) => to.split(',').map(e => Strings.extract(e, /([0-9]+) (.*) bags?/, 
        ([weight, to]) => ({ from, to, weight: Number(weight) }))!)) ?? [];
}

const count = (graph: Graph, start: string) => {
  let current = [ { node: start, multiplier: 1 } ];

  let count = 0;

  while (current.length > 0) {
    const c = current.pop()!;
    count += c.multiplier;

    graph[c.node]?.forEach(t => current.push({ node: t.to, multiplier: c.multiplier * t.weight}));
  }

  return count - 1;
}

export const parse = (input: string[]): Input => {
  return { values: input.flatMap(parseLine) };
}

export const solve = (input: Input): number => {
  const graph: Graph = GraphFactory.fromList(input.values);

  return count(graph, 'shiny gold');
}


console.log(solve(parse(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`.split('\n'))));

console.log(solve(parse(`shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));