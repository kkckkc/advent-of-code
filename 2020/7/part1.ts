import { readFile } from '../../lib/readFile';
import { Edge, Graph, GraphFactory, Graphs } from 'lib/graph';
import { Strings } from 'lib/strings';

type Input = {
  values: Edge[]
};

const parseLine = (s: string) => {
  return Strings.extract(s, /^(.*) bags contain ([0-9].*)\.$/, 
    ([from, to]) => to.split(',').map(e => Strings.extract(e, /([0-9]+) (.*) bags?/, 
        ([weight, to]) => ({ from, to, weight: Number(weight) }))!)) ?? [];
}

export const parse = (input: string[]): Input => {
  return { values: input.flatMap(parseLine) };
}

export const solve = (input: Input): number => {
  const graph: Graph = GraphFactory.fromList(input.values);

  let count = 0;
  for (const start of Object.keys(graph)) {
    if (start !== 'shiny gold' && Graphs.reachable(graph, start, 'shiny gold')) {
      count++;
    }
  }

  return count;
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

console.log(solve(parse(readFile(__dirname))));