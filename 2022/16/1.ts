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
  pos: string;
  open: string[];
  accumulatedFlow: number;
  currentFlow: number;
  state: 'moving' | 'opening';
  log: string[]
}

export const solve = (input: Input): number => {
  const valves = Object.fromEntries(input.values.map(v => [v.id, v]));

  let states: Record<string, State> = {
    'AA-moving': {
      pos: 'AA',
      open: [],
      accumulatedFlow: 0,
      currentFlow: 0,
      state: 'moving',
      log: []
    }
  }

  let min = 1;

  const addState = (target: Record<string, State>, pos, s: State) => {
    const existing = target[`${pos}.${s.state}`];
    if (existing && existing.accumulatedFlow >= (s.accumulatedFlow + s.currentFlow)) return;
    target[`${pos}.${s.state}`] = s;
    s.accumulatedFlow += s.currentFlow;
  }

  while (min <= 30) {
    let newStates: Record<string, State> = {};
    for (const [, state] of Object.entries(states)) {
      const pos = state.pos;
      if (state.state === 'moving') {
        for (const p of valves[pos].leadsTo) {
          addState(newStates, p, {
            ...state,
            pos: p,
            state: 'moving',
            log: [...state.log, `${min} Moving to ${p} - ${state.currentFlow}`]
          });
        }
        if (!state.open.includes(pos)) {
          addState(newStates, pos, {
            ...state,
            state: 'opening',
            log: [...state.log, `${min} Opening to ${pos} - ${state.currentFlow}`]
          })
        }
      } else {
        for (const p of valves[pos].leadsTo) {
          addState(newStates, p, {
            ...state,
            open: [...state.open, state.pos],
            pos: p,
            state: 'moving',
            currentFlow: state.currentFlow + valves[pos].flow,
            log: [...state.log, `${min} Moving to ${p} - ${state.currentFlow + valves[pos].flow}`]
          });
        }
      }
    }

    states = newStates;
    min++;
  }

  const m = Object.values(states).map(s => s.accumulatedFlow).max();

/*  Object.values(states).filter(s => s.accumulatedFlow === m)
    .forEach(e => {
      console.log('---');
      console.log(e.log.join('\n'));
    })*/

  return m;
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

console.log(solve(parse(readFile(__dirname))));
