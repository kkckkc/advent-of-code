export const toDigitArray = (a: number) => {
  const dest: number[] = [];
  while (a >= 10) {
    dest.push(a % 10);
    a = Math.floor(a / 10);
  }
  dest.push(a);
  return dest.reverse();
}

export const Integers = {
  max: 1 << 30,
  mod: (a: number, n: number) => { 
    return ((a%n)+n)%n;
  }
}