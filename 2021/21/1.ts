import {readFile} from "../../lib/readFile";

type Pair = {
  left: Pair | number;
  right: Pair | number;
  parent: Pair | undefined;
  type: 'right' | 'left' | 'root'
}

type Input = {
  rule: number[],
  board: number[][]
};

class Dice {
  p = 1;
  count = 0;

  next() {
    const c = this.p;
    this.p++;
    if (this.p === 101) this.p = 1;
    this.count++;
    return c;
  }
}

export const solve = (p1: number, p2: number): number => {
  const dice = new Dice();

  let s1 = 0, s2 = 0;

  while (true) {
    p1 = p1 + dice.next() + dice.next() + dice.next();
    p1 = ((p1 - 1) % 10) + 1;
    s1 += p1;
    if (s1 >= 1000) break;

    p2 = p2 + dice.next() + dice.next() + dice.next();
    p2 = ((p2 - 1) % 10) + 1;
    s2 += p2;
    if (s2 >= 1000) break;
  }

  return Math.min(s1, s2) * dice.count;
}


console.log(solve(4, 8));
console.log(solve(7, 5));

