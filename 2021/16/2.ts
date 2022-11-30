import { readFile } from "../../lib/readFile";

type Input = string;

interface Package {
  version: number;
  type: number;
  pkgLength: number;
  packageType: 'operator' | 'literal';
  number?: number;
  lengthType?: number,
  length?: number;
  packages?: Package[];
}

export const parse = (input: string[]): Input => {
  console.assert(input[0].length % 2 === 0)
  return input[0].split('').map(c => Number.parseInt(c, 16).toString(2).padStart(4, '0')).join('');
}

const parsePackage = (s: string): Package => {
  let pkgLength = 0;

  const consume = (n: number) => {
    s = s.substring(n);
    pkgLength += n;
  }

  const readBinary = (n: number) => {
    const v = s.substring(0, n);
    consume(n);
    return Number.parseInt(v, 2);
  }

  const version = readBinary(3);
  const type = readBinary(3);

  if (type === 4) {
    let number = 0;
    while (true) {
      const n = readBinary(5);
      number = number * 16 + (n & 0xF);
      if (! (n & 0x10)) break;
    }

    return { packageType: 'literal', pkgLength, type, version, number };
  } else {
    let packages: Package[] = [];

    const lengthType = readBinary(1);
    const length = readBinary(lengthType === 1 ? 11 : 15);

    while (true) {
      const sp = parsePackage(s);
      consume(sp.pkgLength);
      packages.push(sp)
      if (lengthType === 1 && packages.length === length) break;
      if (lengthType === 0 && packages.reduce((p, c) => p + c.pkgLength, 0) === length) break;
    }

    return { packageType: 'operator', pkgLength, type, version, lengthType, length, packages };
  }
}

const evaluate = (p: Package): number => {
  if (p.packageType === 'literal') return p.number!;
  else {
    if (p.type === 0) {
      return p.packages!.map(sp => evaluate(sp)).reduce((p, c) => p + c, 0);
    } else if (p.type === 1) {
      return p.packages!.map(sp => evaluate(sp)).reduce((p, c) => p * c, 1);
    } else if (p.type === 2) {
      return p.packages!.map(sp => evaluate(sp)).reduce((p, c) => Math.min(p, c), Number.MAX_SAFE_INTEGER);
    } else if (p.type === 3) {
      return p.packages!.map(sp => evaluate(sp)).reduce((p, c) => Math.max(p, c), 0);
    } else if (p.type === 5) {
      return evaluate(p.packages![0]) > evaluate(p.packages![1]) ? 1 : 0;
    } else if (p.type === 6) {
      return evaluate(p.packages![0]) < evaluate(p.packages![1]) ? 1 : 0;
    } else if (p.type === 7) {
      return evaluate(p.packages![0]) === evaluate(p.packages![1]) ? 1 : 0;
    } else {
      throw new Error('Unsupported package type');
    }
  }
}

export const solve = (input: Input): number => {
  return evaluate(parsePackage(input));
}

console.log(solve(parse(`C200B40A82`.split('\n'))))
console.log(solve(parse(`04005AC33890`.split('\n'))))
console.log(solve(parse(`880086C3E88112`.split('\n'))))
console.log(solve(parse(`CE00C43D881120`.split('\n'))))
console.log(solve(parse(`D8005AC2A8F0`.split('\n'))))
console.log(solve(parse(`F600BC2D8F`.split('\n'))))
console.log(solve(parse(`9C005AC2F8F0`.split('\n'))))
console.log(solve(parse(`9C0141080250320F1802104A08`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));