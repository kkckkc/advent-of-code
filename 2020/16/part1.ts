import { assertEquals } from '../../lib/assert';
import { readFile } from '../../lib/readFile';
import { range } from '../../lib/arrays';
import { cartesianProduct, nTuples} from '../../lib/combinatorics';

type Field = {
  name: string,
  intervals: {
    from: number,
    to:number
  }[]
}

type Input = {
  fields: Field[],
  yourTicket: number[],
  nearbyTickets: number[][]
};

export const parse = (input: string[]): Input => {
  let fields: Field[] = [];
  let yourTicket: number[] = [];
  let nearbyTickets: number[][] = [];

  let state = 0;

  for (let idx = 0; idx < input.length; idx++) {
    if (input[idx].trim() === '') continue;

    if (input[idx].trim() === 'your ticket:') {
      state = 2;
      continue;
    }

    if (input[idx].trim() === 'nearby tickets:') {
      state = 3;
      continue;
    }

    if (state === 0) {
      fields.push({
        name: input[idx].split(':')[0],
        intervals: input[idx].split(':')[1].trim().split(' or ').map(iv => ({ from: Number(iv.split('-')[0]), to: Number(iv.split('-')[1]) }))
      });
    } else if (state === 1) {
      yourTicket = input[idx].split(/,/g).map(a => Number(a));
    } else {
      nearbyTickets.push(input[idx].split(/,/g).map(a => Number(a)));
    }
  }

  return { fields, nearbyTickets, yourTicket };
}

export const solve = (input: Input): number => {
  let sum = 0;

  for (const ticket of input.nearbyTickets) {
    for (const v of ticket) {
      let valid = false;
      for (const f of input.fields) {
        for (const iv of f.intervals) {
          if (v >= iv.from && v <= iv.to) {
            valid = true;
          }
        }
      }

      if (! valid) sum += v;
    }
  }

  return sum;
}


console.log(solve(parse(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));