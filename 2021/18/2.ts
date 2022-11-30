import {readFile} from "../../lib/readFile";

type Pair = {
  left: Pair | number;
  right: Pair | number;
  parent: Pair | undefined;
  type: 'right' | 'left' | 'root'
}

type Input = string[];

const parsePair = (arr: any[] | number, parent: Pair | undefined, type: Pair['type']): Pair | number => {
  if (Array.isArray((arr))) {
    const pair: Pair = { left: -1, right: -1, parent, type };
    pair.left = parsePair((arr as any[])[0], pair, 'left');
    pair.right = parsePair((arr as any[])[1], pair, 'right');
    return pair;
  } else {
    return arr as number;
  }
}

const pairToString = (p: Pair, d=0): string => {
  return `${d >= 4 ? '*' : ''}[${typeof p.left === 'number' ? p.left : pairToString(p.left, d+1)},${typeof p.right === 'number' ? p.right : pairToString(p.right, d+1)}]`;
}

const add = (left: Pair, right: Pair): Pair => {
  const root: Pair = {
    parent: undefined,
    left,
    right,
    type: 'root'
  }
  left.type = 'left';
  left.parent = root;
  right.type = 'right';
  right.parent = root;
  return root;
}

const findExplodingPair = (p: Pair | number, d=0): Pair | undefined => {
  if (typeof p === 'number') return undefined;
  if (d === 4) return p;
  return findExplodingPair(p.left, d + 1) || findExplodingPair(p.right, d + 1);
}

const findSplittingPair = (p: Pair | number): Pair | undefined => {
  if (typeof p === 'number') return undefined;
  if (typeof p.left === 'number' && p.left >= 10) return p;
  if (findSplittingPair(p.left)) return findSplittingPair(p.left);
  if (typeof p.right === 'number' && p.right >= 10) return p;
  return findSplittingPair(p.right);
}

const applySplit = (p: Pair) => {
  if (typeof p.left === 'number' && p.left >= 10) {
    //  console.log('left')
    p.left = {
      left: Math.floor(p.left as number / 2),
      right: Math.ceil(p.left as number / 2),
      parent: p,
      type: 'left'
    };
  } else {
    //console.log('right')
    p.right = {
      left: Math.floor(p.right as number / 2),
      right: Math.ceil(p.right as number / 2),
      parent: p,
      type: 'right'
    };
  }
}

const applyExplode = (p: Pair) => {
  let pp: Pair | undefined;

  pp = p;
  while (pp && pp.type !== 'right') {
    pp = pp.parent;
  }
  if (pp && pp.type === 'right') {
    let c = pp.parent!.left;
    if (typeof c === 'number') (pp.parent!.left as number) += (p.left as number);
    else {
      while (typeof (c as Pair).right !== 'number') {
        c = (c as Pair).right;
      }
      ((c as Pair).right as number) += (p.left as number);
    }
  }

  pp = p;
  while (pp && pp.type !== 'left') {
    pp = pp.parent;
  }
  if (pp && pp.type === 'left') {
    let c = pp.parent!.right;
    if (typeof c === 'number') (pp.parent!.right as number) += (p.right as number);
    else {
      while (typeof (c as Pair).left !== 'number') {
        c = (c as Pair).left;
      }
      ((c as Pair).left as number) += (p.right as number);
    }
  }

  if (p.type === 'left') p.parent!.left = 0;
  if (p.type === 'right') p.parent!.right = 0;
}

export const parse = (input: string[]): Input => {
  return input;
}

const magnitude = (p: Pair | number): number => {
  if (typeof p === 'number') return p as number;
  return 3 * magnitude(p.left) + 2 * magnitude(p.right);
}

export const solve = (input: Input): number => {
  let max = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i == j) continue;

      const a = add(
        parsePair(eval(input[i]), undefined, 'root') as Pair,
        parsePair(eval(input[j]), undefined, 'root') as Pair);

      while (true) {
        let p = findExplodingPair(a);
        if (!!p) {
          applyExplode(p);
          continue;
        }

        p = findSplittingPair(a);
        if (!!p) {
          applySplit(p);
          continue;
        }
        break;
      }
/*
      console.log('---------------')
      console.log(i, j);
      console.log(input[i])
      console.log(input[j])
      console.log(pairToString(a))
      console.log(magnitude(a))
*/
      const m = magnitude(a);
      max = Math.max(max, m);
    }
  }

  return max;
}

/*console.log(solve(parse(`[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]`.split('\n'))))*/

console.log(solve(parse(`[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`.split('\n'))))

console.log(solve(parse(readFile(__dirname))));