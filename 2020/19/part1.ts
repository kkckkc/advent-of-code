import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Input = {
  rules: Record<number, { opt1: any[], opt2: any[] }>,
  messages: string[]
};

export const parse = (input: string[]): Input => {
  const dest: Input = {
    rules: {},
    messages: []
  };

  let rules = true;
  for (const line of input) {
    if (line.trim() === '') rules = false;
    else if (rules) {
      const number = Number(line.split(':')[0].trim());
      const v = line.split(':')[1].trim();
      const left = v.split('|')[0].trim();
      const right = v.split('|')[1]?.trim();

      dest.rules[Number(number)] = {
        opt1: left.split(' ').map(a => a[0] === '"' ? a[1] : Number(a)),
        opt2: right ? right.split(' ').map(a => a[0] === '"' ? a[1] : Number(a)) : []
      }
    } else {
      dest.messages.push(line);  
    }
  }
  return dest;
}

export const solve = (input: Input): number => {
  const patterns: Record<number, string> = {};

  while (Object.keys(patterns).length < Object.keys(input.rules).length) {
    const [k, v] = Object.entries(input.rules)
      .filter(([k]) => !(k in patterns))
      .find(([_, v]) => {
        return v.opt1.every(e => typeof(e) === 'string' || e in patterns) && 
          v.opt2.every(e => typeof(e) === 'string' || e in patterns);
      })!;

    if (v.opt2.length === 0) {
      patterns[Number(k)] = v.opt1.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')
    } else {
      patterns[Number(k)] = `((${v.opt1.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')})|(${v.opt2.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')}))`;
    }
  }

  const regexps = Object.fromEntries(Object.entries(patterns).map(([k, v]) => [k, new RegExp(`^${v}$`)]));

/*  for (const m of input.messages) {
    console.log(m, Object.entries(regexps).find(([_, v]) => m.match(v)))
  }*/

  return input.messages.filter(msg => Object.values(regexps).some(p => msg.match(p) !== null)).length;

//  console.log(JSON.stringify(input, undefined, 2));
  return 0;
}


console.log(solve(parse(`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`.split('\n'))))

console.log(solve(parse(readFile(__dirname))));