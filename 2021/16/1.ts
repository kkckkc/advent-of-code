import {readFile} from "../../lib/readFile";

type Input = string;

export const parse = (input: string[]): Input => {
  let dest = [];

  let s = input[0];
  while (s.length > 0) {
    if (s.length === 1) {
      dest.push(Number.parseInt(s + '0', 16).toString(2).padStart(8, '0'));
      s = '';
    } else {
      dest.push(Number.parseInt(s.substring(0, 2), 16).toString(2).padStart(8, '0'));
      s = s.substring(2);
    }
  }

  return dest.join('');
}

interface Package {
  version: number;
  type: number;
  pkgLength: number;
  packageType: 'operator' | 'literal';
}

interface LiteralPackage extends Package {
  packageType: 'operator';
  numbers?: number[];
}

interface OperatorPackage extends Package {
  packageType: 'literal';
  lengthType?: 'bits' | 'packages';
  length?: number;
  packages?: Package[];
}

const parsePackage = (s: string): Package | OperatorPackage | LiteralPackage => {
  let pkgLength = 0;

  const version = Number.parseInt(s.substring(0, 3), 2);
  pkgLength += 3;
  s = s.substring(3);

  const type = Number.parseInt(s.substring(0, 3), 2);
  pkgLength += 3;
  s = s.substring(3);

  if (type === 4) {
    let numbers: number[] = [];
    let lit;
    do {
      lit = s.substring(0, 5);
      pkgLength += 5;
      s = s.substring(5);

      numbers.push(Number.parseInt(lit.substring(1), 2));
    } while (lit[0] === '1');

    return {
      packageType: 'literal',
      pkgLength,
      type,
      version,
      numbers
    }
  } else {
    const lengthType = s.substring(0, 1);
    pkgLength++;
    s = s.substring(1);

    let subpackages: Package[] = [];

    let length;
    if (lengthType === '1') {
      length = Number.parseInt(s.substring(0, 11), 2);
      pkgLength += 11;
      s = s.substring(11);

      for (let i = 0; i < length; i++) {
        const sp = parsePackage(s);
        s = s.substring(sp.pkgLength);
        pkgLength += sp.pkgLength;
        subpackages.push(sp)
      }
    } else {
      length = Number.parseInt(s.substring(0, 15), 2);
      pkgLength += 15;
      s = s.substring(15);

      let subpackageBits = 0;
      while (subpackageBits < length) {
        const sp = parsePackage(s);
        s = s.substring(sp.pkgLength);
        pkgLength += sp.pkgLength;
        subpackageBits += sp.pkgLength;
        subpackages.push(sp)
      }
    }

    return {
      packageType: 'operator',
      pkgLength,
      type,
      version,
      lengthType: lengthType === '0' ? 'bits' : 'packages',
      length: length,
      packages: subpackages
    }
  }
}

const calcVersion = (p: Package): number => {
  if (p.packageType === 'literal') return p.version;
  else {
    const op: OperatorPackage = p as OperatorPackage;
    return p.version + op.packages!.map(sp => calcVersion(sp)).reduce((p, c) => p + c, 0);
  }
}

export const solve = (input: Input): number => {
  let s = input;

  const pkg = parsePackage(s);
  s = s.substring(pkg.pkgLength);

  return calcVersion(pkg);
}

//console.log(solve(parse(`EE00D40C823060`.split('\n'))))
console.log(solve(parse(`8A004A801A8002F478`.split('\n'))))
console.log(solve(parse(`620080001611562C8802118E34`.split('\n'))))
console.log(solve(parse(`C0015000016115A2E0802F182340`.split('\n'))))
console.log(solve(parse(`A0016C880162017C3686B18A3D4780`.split('\n'))))
console.log(solve(parse(readFile(__dirname))));