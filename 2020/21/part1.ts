import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

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

const intersection = (a: Set<string>, b: Set<string>) => new Set([...a].filter(x => b.has(x)));

export const solve = (input: Input): number => {
//  console.log(JSON.stringify(input, null, '  '));
  
  const allergens: Set<string> = new Set();
  input.values.forEach(r => r.allergens.forEach(a => allergens.add(a)));

  const ingredients: Map<string, number> = new Map();
  input.values.forEach(r => r.ingredients.forEach(a => ingredients.set(a, (ingredients.get(a) ?? 0) + 1)));

  const p: Record<string, Set<string>> = {};

  for (const a of allergens) {
    for (const v of input.values.filter(v => v.allergens.includes(a))) {
      const s = p[a];
      if (s) {
        p[a] = intersection(p[a], new Set(v.ingredients));
      } else {
        p[a] = new Set(v.ingredients);
      }
    }
  }

  const usedIngredients: Set<string> = new Set();
  for (const [k, v] of Object.entries(p)) {
    v.forEach(a => usedIngredients.add(a));
  }

  return Array.from(ingredients.keys()).filter(i => !usedIngredients.has(i))
      .reduce((acc, c) => ingredients.get(c)! + acc, 0);
  
}


console.log(solve(parse(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));