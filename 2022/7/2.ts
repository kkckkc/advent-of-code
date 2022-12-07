import { readFile } from "lib/readFile";
import { applyPatches } from "lib/patch";
applyPatches();

type Input = {
  values: string[];
};

export const parse = (input: string[]): Input => {
  return { values: input };
};

type DirEntry = {
  name: string;
  children: DirEntry[];
  size?: number;
  type: 'd' | 'f'
}

const calcSize = (d: DirEntry): number => {
  if (d.type === 'd') d.size = d.children.reduce((p, c) => p + calcSize(c), 0);
  return d.size;
}

const findSmallest = (d: DirEntry, maxSize: number): number => {
  if (d.type === 'f') return 0;  
  if (d.size >= maxSize) {
    const matching = d.children
      .map(e => findSmallest(e, maxSize))
      .filter(s => s >= maxSize);

    return Math.min(...[...matching, d.size]);
  }
  return d.size;
}

export const solve = (input: Input): number => {
  const cwd: DirEntry[] = [
    { 
      name: '/',
      children: [],
      type: 'd'
    }
  ];

  for (const l of input.values) {
    if (l.startsWith('$ cd /')) {
      // ignore
    } else if (l.startsWith('$ cd ..')) {
      cwd.pop();
    } else if (l.startsWith('$ cd ')) {
      const [,,dir] = l.split(" ");
      cwd.push(cwd.at(-1).children.find(a => a.name === dir));
    } else if (l.startsWith('$ ls')) {
      // Ignore
    } else if (l.startsWith('dir')) {
      const [,name] = l.split(" ");
      cwd.at(-1).children.push({
        name,
        children: [],
        type: 'd'
      })
    } else {
      const [size,name] = l.split(" ");
      cwd.at(-1).children.push({
        name,
        size: Number(size),
        children: [],
        type: 'f'
      })
    }
  }

  calcSize(cwd[0]);

  return findSmallest(cwd[0], 30000000 - (70000000 - cwd[0].size));
};

console.log(solve(parse(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`.split('\n'))));

console.log(solve(parse(readFile(__dirname))));
