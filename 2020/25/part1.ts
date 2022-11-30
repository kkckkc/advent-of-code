const MOD = 20201227;

const findLoop = (t: number): number => {
  let a = 1, i = 1;
  while (true) {
    a = (a * 7) % MOD;
    if (a === t) return i;
    i++;
  }
}

const transform = (subject: number, loopSize: number): number => {
  let a = 1;
  for (let i = 0; i < loopSize; i++) {
    a = (a * subject) % MOD;
  }
  return a;
}


export const solve = (card: number, door: number): number => {
  const cardLoop = findLoop(card);

  return transform(door, cardLoop);
}


console.log(solve(5764801, 17807724))
console.log(solve(13233401, 6552760))
