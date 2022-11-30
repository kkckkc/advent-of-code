export const parseGrid = <T>(input: string[], mapping: Record<string, T>) => {
  return { 
    rows: input.map(i => i.split('').map(c => mapping[c])),
    rowLength: input[0].length
  };
}

export type Grid<T> = {
  rows: T[][],
  rowLength: number
}