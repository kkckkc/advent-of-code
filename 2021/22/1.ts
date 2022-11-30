import {readFile} from "../../lib/readFile";

type Cube = {
  state: 'on' | 'off'
  x: number[],
  y: number[],
  z: number[]
}

type Input = {
  cubes: Cube[]
};

export const parse = (input: string[]): Input => {
  const toRange = (s: string): number[] => {
    return s.split('..').map(a => Number(a));
  }
  return {
    cubes: input.map(r => {
      const arr = r.split(' ');
      return {
        state: arr[0] as 'on' | 'off',
        x: toRange(arr[1].split(',')[0].split('=')[1]),
        y: toRange(arr[1].split(',')[1].split('=')[1]),
        z: toRange(arr[1].split(',')[2].split('=')[1]),
      }
    })
  }
}
export const solve = (input: Input): number => {
  const lights: Record<string, string> = {};

  for (const cube of input.cubes) {
    if (Math.abs(cube.x[0]) > 50) continue;
    if (Math.abs(cube.x[1]) > 50) continue;
    if (Math.abs(cube.y[0]) > 50) continue;
    if (Math.abs(cube.y[1]) > 50) continue;
    if (Math.abs(cube.z[0]) > 50) continue;
    if (Math.abs(cube.z[1]) > 50) continue;

    for (let x = cube.x[0]; x <= cube.x[1]; x++) {
      for (let y = cube.y[0]; y <= cube.y[1]; y++) {
        for (let z = cube.z[0]; z <= cube.z[1]; z++) {
          lights[[x,y,z].join(',')] = cube.state;
        }
      }
    }
  }

  return Object.entries(lights).filter(([, v]) => v === 'on').length;
}


console.log(solve(parse(`on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
