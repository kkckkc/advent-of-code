import {readFile} from "../../lib/readFile";
import { nTuples } from "../../lib/combinatorics";

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


export const solve = (p1: number, p2: number): number => {
  console.log('----------');

  let uc = 1;

  let d = [...new Array(22)]
  d.fill(0);
  for (const a of nTuples([1, 2, 3], 3, 'all').map(a => a.reduce((b, c) => b + c, 0))) {
    d[a]++;
  }

  let sp1: number[][] = [], sp2: number[][] = [];
  for (let s = 0; s <= 22; s++) {
    sp1[s] = [];
    sp2[s] = [];
    for (let p = 0; p <= 11; p++) {
      sp1[s].push(0);
      sp2[s].push(0);
    }
  }

  sp1[0][p1] = 1;
  sp2[0][p2] = 1;

  let it = 0;
  while (true) {
    uc *= 27;

    let nsp1: number[][] = [], nsp2: number[][] = [];
    for (let s = 0; s <= 22; s++) {
      nsp1[s] = [];
      nsp2[s] = [];
      for (let p = 0; p <= 11; p++) {
        nsp1[s].push(0);
        nsp2[s].push(0);
      }
    }

    for (let s = 0; s < sp1.length; s++) {
      for (let p = 0; p < sp1[s].length; p++) {
        if (sp1[s][p] === 0) continue;
        for (let i = 0; i < d.length; i++) {
          if (d[i] === 0) continue;
          const newPos = (p + i - 1) % 10 + 1;
          const newScore = Math.min(21, s + newPos);
          nsp1[newScore][newPos] += sp1[s][p] * d[i];
        }
      }
    }

    for (let s = 0; s < sp2.length; s++) {
      for (let p = 0; p < sp2[s].length; p++) {
        if (sp2[s][p] === 0) continue;
        for (let i = 0; i < d.length; i++) {
          if (d[i] === 0) continue;
          const newPos = (p + i - 1) % 10 + 1;
          const newScore = Math.min(21, s + newPos);
          nsp2[newScore][newPos] += sp2[s][p] * d[i];
        }
      }
    }



    sp1 = nsp1;
    sp2 = nsp2;

    let sum1 = sp1.slice(0, 21).reduce((b, c) => b + c.reduce((b1, c1) => b1 + c1, 0), 0);
    let sum2 = sp2.slice(0, 21).reduce((b, c) => b + c.reduce((b1, c1) => b1 + c1, 0), 0);
/*
    console.log(++it, '---')
    console.log(sp1[0].map(a => a.toString()).join(' '));
    console.log(sp1[1].map(a => a.toString()).join(' '));
    console.log(sp1[2].map(a => a.toString()).join(' '));
    console.log(sp1[3].map(a => a.toString()).join(' '));
    console.log(sp1[4].map(a => a.toString()).join(' '));
    console.log(sp1[5].map(a => a.toString()).join(' '));
    console.log(sp1[6].map(a => a.toString()).join(' '));*/
/*    console.log(sp1.slice(1).findIndex(a => !a.every(k => k === 0)) + 1, sp2.slice(1).findIndex(a => !a.every(k => k === 0)) + 1);
    console.log(sum1, sum2);
    console.log(sp1[21].reduce((b, c) => b + c, 0), sp2[21].reduce((b, c) => b + c, 0));
    console.log(sp1.reduce((b, c) => b + c.reduce((b1, c1) => b1 + c1, 0), 0), sp2.reduce((b, c) => b + c.reduce((b1, c1) => b1 + c1, 0), 0))*/

    //if (it == 2) process.exit();

    console.log(uc, sum1, sum2);

    if (sum1 === 0 || sum2 === 0) break;

    //console.log(sp1);
    //process.exit(1);

    // 3984369595
    // 444356092776315
  }

  console.log(d);
  console.log(sp1[21].reduce((b, c) => b + c, 0))
  console.log(sp2[21].reduce((b, c) => b + c, 0))

  // 9007199254740991
  // 444356092776315
  // 205891132094649

  /*console.log(pos1, pos2);
  console.log(s1, s2);
  console.log(s1[21], s2[21]);*/
  return 0;
}



console.log(solve(4, 8));
//console.log(solve(7, 5));

