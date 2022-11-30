import { range, fill } from './arrays';

export const cartesianProduct = <T>(...sets: T[][]) =>
  sets.reduce<T[][]>((accSets, set) => accSets.flatMap(accSet => set.map(value => [...accSet, value])), [[]]);

export const cartesianProductIncreasing = <T>(...sets: T[][]) =>
  sets.reduce<T[][]>((accSets, set) => accSets.flatMap(accSet => set
    .filter(value => accSet.length === 0 || value > accSet[accSet.length - 1])
    .map(value => [...accSet, value])), [[]]);

export const nTuples = <T>(arr: T[], n: number, type: 'all' | 'unique' | 'increasing'): T[][] => {
  const sets: number[][] = fill(n, range(0, arr.length - 1));
  const cp = type === 'increasing' ? cartesianProductIncreasing(...sets) : cartesianProduct(...sets);
  const filter = type !== 'unique' 
    ? ((_ : number[]) => true) 
    : (a: number[]) => {
      if (type !== 'unique') return true;
      return [...new Set(a)].length === a.length;
    };
  return cp
    .filter(filter)
    .map((a: number[]) => {
      return a.map(e => arr[e])
    });
}

export const permutations = <T>(inputArr: T[]): T[][] => {
  let result: T[][] = [];

  const permute = (arr: T[], m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next as any));
      }
    }
  }

  permute(inputArr)

  return result;
}