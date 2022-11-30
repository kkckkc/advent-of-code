export const asGrid = (arr: string[], width: number) => {
  let s = '';
  for (let i = 0; i < arr.length; i++) {
    if (i % width === 0 && i !== 0) {
      s += '\n';
    }
    s += arr[i];
  }
  return s;
}