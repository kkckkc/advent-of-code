import {readFile} from "../../lib/readFile";

type Pair = {
  left: Pair | number;
  right: Pair | number;
  parent: Pair | undefined;
  type: 'right' | 'left' | 'root'
}

type Input = Scanner[];

type Scanner = {
  coordinates: number[][]
};

export const parse = (input: string[]): Input => {
  const scanners: Scanner[] = [];
  let scanner: Scanner | undefined = undefined;
  for (const s of input) {
    if (s.trim() === '') continue;
    if (s.startsWith('---')) {
      scanner = {
        coordinates: []
      };
      scanners.push(scanner);
    } else {
      scanner.coordinates.push(s.split(',').map(a => Number(a)))
    }
  }
  return scanners;
}

const dis = ([a, b, c]: number[], [a2, b2, c2]: number[]) => {
  return Math.sqrt(Math.pow(a - a2, 2) + Math.pow(b - b2, 2) + Math.pow(c - c2, 2));
}
/*
const orientations: ((a : number[]) => number[])[] = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, -y, z],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, y, -z],
  ([x, y, z]) => [-x, y, z],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, -y, -z],

  ([x, y, z]) => [y, x, z],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, x, -z],
  ([x, y, z]) => [-y, -x, z],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, -x, -z],
  ([x, y, z]) => [y, x, -z],

  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [-z, x, y],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, -x, -y],
  ([x, y, z]) => [z, -x, y],
  ([x, y, z]) => [z, -x, y],
  ([x, y, z]) => [z, x, -y],

  ([x, y, z]) => [x, z, y],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, z, -y],
  ([x, y, z]) => [-x, -z, y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [x, -z, -y],
  ([x, y, z]) => [x, z, -y],

  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [-y, z, x],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-y, -z, -x],
  ([x, y, z]) => [y, -z, x],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [y, z, -x],

  ([x, y, z]) => [z, y, x],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, y, -x],
  ([x, y, z]) => [-z, -y, x],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, y, -x],
]*/


const orientations: ((a : number[]) => number[])[] = [
  ([a, x, y]) => [a, x, y],
  ([a, x, y]) => [a, -y, x],
  ([a, x, y]) => [a, -x, -y],
  ([a, x, y]) => [a, y, -x],

  ([a, x, y]) => [-a, y, x],
  ([a, x, y]) => [-a, -x, y],
  ([a, x, y]) => [-a, -y, -x],
  ([a, x, y]) => [-a, x, -y],


  ([y, a, x]) => [a, x, y],
  ([y, a, x]) => [a, -y, x],
  ([y, a, x]) => [a, -x, -y],
  ([y, a, x]) => [a, y, -x],

  ([y, a, x]) => [-a, y, x],
  ([y, a, x]) => [-a, -x, y],
  ([y, a, x]) => [-a, -y, -x],
  ([y, a, x]) => [-a, x, -y],


  ([x, y, a]) => [a, x, y],
  ([x, y, a]) => [a, -y, x],
  ([x, y, a]) => [a, -x, -y],
  ([x, y, a]) => [a, y, -x],

  ([x, y, a]) => [-a, y, x],
  ([x, y, a]) => [-a, -x, y],
  ([x, y, a]) => [-a, -y, -x],
  ([x, y, a]) => [-a, x, -y],
]


const overlap = (a: number[][], b: number[][]): number[] => {
  return a.filter(k => b.find(q => q[0] === k[0])).map(a => a[0]);
}

function getVector(distance: number[][], input: number[][], dis: number, or=orientations[0]): any {
  let [,i,j] = distance.find(d => d[0] === dis);

  let a = or(input[i]);
  let b = or(input[j]);

  if (a[0] > b[0]) {
    [a,b] = [b,a]
  }

  return [a, b, [b[0] - a[0], b[1] - a[1], b[2] - a[2]]];
}

function eq(a: number[], b: number[]) {
  return (a[0] === b[0] && a[1] === b[1] && a[2] == b[2]);
}

export const solve = (input: Input): number => {
  let count = input.reduce((p, c) => p + c.coordinates.length, 0);

  let distances: number[][][] = [];
  for (const s of input) {
    let d: number[][] = [];
    distances.push(d);

    for (let i = 0; i < s.coordinates.length; i++) {
      for (let j = 0; j < s.coordinates.length; j++) {
        if (i === j) continue;
        d.push([dis(s.coordinates[i], s.coordinates[j]), i, j])
      }
    }

    d.sort((a, b) => a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1);
  }

  let positions: (number[] | undefined)[] = input.map(() => undefined);
  positions[0] = [0, 0, 0];

  let coordinates: Set<string> = new Set<string>();
  input[0].coordinates.forEach(a => coordinates.add(a.join(',')));

  let overlapCount = 0;
  while (!positions.every(a => Array.isArray(a))) {
    //console.log(positions);
    for (let i = 0; i < input.length; i++) {
      if (! positions[i]) continue;
      for (let j = 0; j < input.length; j++) {
        if (i === j || positions[j]) continue;

        let o = overlap(distances[i], distances[j]);
        if (o.length === 132) {
          overlapCount++;

          //console.log(i, j);

          let av1 = getVector(distances[i], input[i].coordinates, o[0]);
          let av2 = getVector(distances[i], input[i].coordinates, o[2]);

          for (let k = 0; k < orientations.length; k++) {
            let obv1 = getVector(distances[j], input[j].coordinates, o[0]);
            let obv2 = getVector(distances[j], input[j].coordinates, o[2]);

            let bv1 = obv1.map(a => orientations[k](a));
            let bv2 = obv2.map(a => orientations[k](a));

            if (av1[2][0] !== bv1[2][0]) {
              bv1 = [bv1[1], bv1[0], [-bv1[2][0], -bv1[2][1], -bv1[2][2]]];
            }

            if (av2[2][0] !== bv2[2][0]) {
              bv2 = [bv2[1], bv2[0], [-bv2[2][0], -bv2[2][1], -bv2[2][2]]];
            }

            if (eq(av1[2], bv1[2]) && eq(av2[2], bv2[2])) {
              const dx = av1[0][0] - bv1[0][0];
              const dy = av1[0][1] - bv1[0][1];
              const dz = av1[0][2] - bv1[0][2];

              // @ts-ignore
              positions[j] = [dx, dy, dz];


              input[j].coordinates = input[j].coordinates
                .map(a => orientations[k](a))
                .map(([x, y, z]) => [x + dx, y + dy, z + dz]);
              input[j].coordinates.forEach(a => coordinates.add(a.join(',')));

              break;
            }
          }
        }
      }
    }
  }

  /*console.log([...coordinates].sort((a, b) => {
    let na = Number(a.split(',')[0]);
    let nb = Number(b.split(',')[0]);
    return na > nb ? 1 : na < nb ? -1 : 0;
  }));*/
  //console.log(positions);
  //console.log(coordinates.size)

  //console.log(input[1].coordinates)

  let max = 0;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      max = Math.max(
        Math.abs(positions[i]![0] - positions[j]![0]) +
        Math.abs(positions[i]![1] - positions[j]![1]) +
        Math.abs(positions[i]![2] - positions[j]![2]), max)
    }
  }

  return max;
}

console.log(solve(parse(`--- scanner 0 ---
-618,-824,-621
-537,-823,-458
-447,-329,318
404,-588,-901
544,-627,-890
528,-643,409
-661,-816,-575
390,-675,-793
423,-701,434
-345,-311,381
459,-707,401
-485,-357,347

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
-476,619,847
-460,603,-452
729,430,532
-322,571,750
-355,545,-477
413,935,-424
-391,539,-444
553,889,-390`.split('\n'))))

console.log('----------------------')

console.log(solve(parse(`--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`.split('\n'))));

console.log('----------------------')


console.log(solve(parse(readFile(__dirname))));