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

    if (Number(k) === 8) {
      patterns[Number(k)] = `(${patterns[42]})+`;
    } else if (Number(k) === 11) {
      patterns[Number(k)] = `(((${patterns[42]})(${patterns[31]}))|((${patterns[42]})(${patterns[42]})(${patterns[31]})(${patterns[31]}))|((${patterns[42]})(${patterns[42]})(${patterns[42]})(${patterns[31]})(${patterns[31]})(${patterns[31]}))|((${patterns[42]})(${patterns[42]})(${patterns[42]})(${patterns[42]})(${patterns[31]})(${patterns[31]})(${patterns[31]})(${patterns[31]})))`;
    } else if (v.opt2.length === 0) {
      patterns[Number(k)] = v.opt1.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')
    } else {
      patterns[Number(k)] = `((${v.opt1.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')})|(${v.opt2.map(e => typeof(e) === 'string' ? e : patterns[e]).join('')}))`;
    }
  }

  const regexps = Object.fromEntries(Object.entries(patterns).map(([k, v]) => [k, new RegExp(`^${v}$`)]));

  /*
  for (const m of input.messages) {
    console.log(m, Object.entries(regexps).find(([_, v]) => m.match(v))?.[0])
  }
  */


  //console.log(input.messages.filter(msg => Object.values(regexps).some(p => msg.match(p) !== null)));

  return input.messages.filter(msg => msg.match(regexps[0])).length;

//  console.log(JSON.stringify(input, undefined, 2));
  return 0;
}


console.log(solve(parse(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`.split('\n'))))

console.log(solve(parse(readFile(__dirname))));