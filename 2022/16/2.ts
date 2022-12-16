import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
import { stringify } from 'querystring';
import { Stats } from 'fs';
applyPatches();

type Valve = {
  id: string;
  flow: number;
  leadsTo: string[];
}

type Input = {
  values: Valve[];
};

export const parse = (input: string[]): Input => {
  return { values: input.map(l => {
    return {
      id: l.split(' ')[1],
      flow: Number(l.split(' ')[4].split('=')[1].split(';')[0]),
      leadsTo: l.split(/leads? to valves? /)[1].split(', ')
    }
  }) };
};

type State = {
  pos: string[];
  open: string[];
  accumulatedFlow: number;
  currentFlow: number;
  state: ('moving' | 'opening')[];
  log: string[]
}

const cloneAndSet = <T>(arr: T[], pos: number, newVal: T): T[] => {
  const d = [...arr];
  d[pos] = newVal;
  return d;
}

const addState = (target: Record<string, State>, pos: string[], s: State, remain: number) => {
  const key = `${pos[0]},${s.state[0]},${pos[1]},${s.state[1]}`;
  const existing = target[key];
  if (existing && (existing.accumulatedFlow + existing.currentFlow * remain) >= (s.accumulatedFlow + s.currentFlow * remain)) return;
  target[key] = s;
}

export const solve = (input: Input): number => {
  const valves = Object.fromEntries(input.values.map(v => [v.id, v]));

  const ALL_MOVING: any[] = ['moving', 'moving'];

  let states: Record<string, State> = {
    '': {
      pos: ['AA', 'AA'],
      open: [],
      accumulatedFlow: 0,
      currentFlow: 0,
      state: ALL_MOVING,
      log: []
    }
  }

  let min = 1;

  const MIN_COUNT = 26;
  while (min <= MIN_COUNT) {
    let cycleStates = Object.values(states); 
    for (let actor = 0; actor < 2; actor++) {
      const newStates: State[] = [];
      for (const state of cycleStates) {
        const pos = state.pos;        
        const open = state.open;

        if (!state.open.includes(pos[actor]) && valves[pos[actor]].flow > 0) {
          newStates.push({
            ...state,
            state: cloneAndSet(state.state, actor, 'opening'),
            open: [...open, state.pos[actor]]
          })
        }
          
        for (const p of valves[pos[actor]].leadsTo) {
          newStates.push({
            ...state,
            pos: cloneAndSet(state.pos, actor, p),
            state: cloneAndSet(state.state, actor, 'moving')
          });
        }
      }

      cycleStates = newStates;
    }

    // Keep the best so far
    states = {};
    cycleStates.forEach(s => addState(states, s.pos, s, MIN_COUNT - min + 1));

    // update current flow for all opening states
    Object.values(states).forEach(s => {
      s.accumulatedFlow += s.currentFlow;
      s.currentFlow += (
        (s.state[0] === 'opening' ? valves[s.pos[0]].flow : 0) +
        (s.state[1] === 'opening' ? valves[s.pos[1]].flow : 0)
      )
      s.state = ALL_MOVING
    })

    min++;
  }

  return Object.values(states).map(s => s.accumulatedFlow).max();
};

console.log(solve(parse(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`.split('\n'))));

const d = new Date().getTime();
console.log(solve(parse(readFile(__dirname))));
console.log(`--- duration ${new Date().getTime() - d}`)
