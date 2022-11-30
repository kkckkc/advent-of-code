import { readFile } from '../../lib/readFile';

type Field = {
  name: string,
  intervals: {
    from: number,
    to:number
  }[]
}

type Input = {
  fields: Field[],
  nearbyTickets: number[][]
};

export const parse = (input: string[]): Input => {
  const lines = input.map(l => l.trim()).filter(l => l !== '' && l !== 'your ticket:' && l !== 'nearby tickets:');

  return { 
    fields: lines.filter(l => l.indexOf(':') >= 0).map(l => ({
      name: l.split(':')[0],
      intervals: l.split(':')[1].trim().split(' or ').map(iv => ({ from: Number(iv.split('-')[0]), to: Number(iv.split('-')[1]) }))
    })),
    nearbyTickets: lines.filter(l => l.indexOf(':') < 0).map(l => l.split(/,/g).map(a => Number(a)))
  };
}

export const solve = (input: Input): number => {
  const validFields = input.nearbyTickets[0].map(_ => new Set(input.fields.map(f => f.name)));

  const isValid = (v: number, f: Field) => f.intervals.some(iv => v >= iv.from && v <= iv.to)

  input.nearbyTickets.filter(ticket => ticket.every(v => input.fields.some(f => isValid(v, f))))
    .forEach(ticket => ticket.forEach((v, idx) => input.fields
      .filter(f => !isValid(v, f))
      .forEach(f => validFields[idx].delete(f.name))));

  const assignment = new Array(input.nearbyTickets[0].length); 
  for (let i = 0; i < assignment.length; i++) {
    const oneIdx = validFields.findIndex(a => a.size === 1);
    assignment[oneIdx] = Array.from(validFields[oneIdx].values())[0]

    validFields.forEach(vf => vf.delete(assignment[oneIdx]));
  }

  return assignment.reduce((acc, c, idx) => c.startsWith('departure') ? input.nearbyTickets[0][idx] * acc : acc, 1)
}


console.log(solve(parse(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`.split('\n'))));

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