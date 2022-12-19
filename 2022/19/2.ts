import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();


type Input = {
  values: number[][][];
};

const arr = ['ore', 'clay', 'obsidian', 'geode']

export const parse = (input: string[]): Input => {
  const s = input.map(l => l.split(':')[1].split('.')
    .map(e => e.split(/(costs|and) /)
    .filter(e => e !== '' && !isNaN(e.trim().charAt(0) as any))
    .map(e => e.split(' ').filter(e => e !== ''))
    ).filter(e => e.length > 0));
  return { values: s.map(v => v.map(e => arr.map(a => Number(e.find(k => k[1] === a)?.[0] ?? 0)))) }
};

const best = (q: [number, number[], number[]][], blueprint: number[][]) => {
  let c = 0;
  let b = 0;
  while (q.length > 0) {
    const a = q.pop() as any;
    const [min, robots, stash] = a;
    b = Math.max(b, stash[3]);

    if (min === 0) continue;

    let canBuildGeode = false;
    let something = false;
    for (let r = 3; r >= 0; r--) {
      if (!canBuildGeode && stash.every((m, idx) => m >= blueprint[r][idx])) {
        if (r === 3/* || r === 2*/) canBuildGeode = true;

//        if (r === 2 && robots[2] > 12) continue;
//        if (r === 1 && robots[1] > 20) continue;
        if (r === 0 && robots[0] > 4) continue;

        if ((stash[3] + robots[3] * min + ((min) * (min - 1)) / 2) <= b) continue;

        const newRobots = [...robots];
        newRobots[r]++;
  
        const newStash = stash.add(robots);
        for (let i = 0; i < 4; i++) {
          newStash[i] -= blueprint[r][i];
        }

        q.push([min - 1, newRobots, newStash]);
        c++;
        something = true;
      }
    }

    if (!canBuildGeode && (stash[0] < 5 || !something)) {
      q.push([min - 1, robots, stash.add(robots)]);
      c++;
    }
  }

  console.log(`--count ${c}`)

  return b;
}

export const solve = (input: Input): number => {

  let score = 1;

  for (let b = 0; b < input.values.length && b < 3; b++) {

    const cache: Record<string, number> = {};
    let q: [number, number[], number[]][] = [[32, [1, 0, 0, 0], [0, 0, 0, 0]]];
    let a = best(q, input.values[b])
    console.log(a, Object.keys(cache).length);
    score *= a;
  }

  return score;
};

console.log(solve(parse(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`.split('\n'))));

/*
  ore -> clay
  ore, clay -> obsidian
  ore, obsidian -> geode
*/

console.log('------------------------------------')

console.log(solve(parse(readFile(__dirname))));
