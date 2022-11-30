import { readFile } from '../../lib/readFile';

type Input = {
  values: {
    ingredients: string[],
    allergens: string[]
  }[]
};

export const parse = (input: string[]): Input => {
  return { values: input.map(line => ({
    ingredients: line.split('(')[0].split(' ').filter(s => s.trim().length > 0),
    allergens: line.split('(')[1].split(',').map(a => a.trim().replace(')', '').replace('contains ', ''))
  })) };
}

const intersection = (a: Set<string>|undefined, b: Set<string>) => a === undefined ? b : new Set([...a].filter(x => b.has(x)));

export const solve = (input: Input): string => {
  const allergens: Set<string> = new Set(input.values.flatMap(r => r.allergens));

  const p: Record<string, Set<string>> = {};

  for (const a of allergens) {
    p[a] = input.values
      .filter(v => v.allergens.includes(a))
      .reduce((acc, c, idx) => intersection(idx === 0 ? undefined : acc, new Set(c.ingredients)), new Set<string>());
  }

  const res: Record<string, string> = {};
  const used: Set<string> = new Set<string>();

  while (Object.keys(p).length > used.size) {
    for (const [k, v] of Object.entries(p)) {
      const rem = [...v].filter(e => !used.has(e));
      if (rem.length === 1) {
        res[k] = rem[0];
        used.add(rem[0]);
        break;
      }
    }
  }

  return [...allergens].sort().filter(a => res[a]).map(a => res[a]).join(',');
}


console.log(solve(parse(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));