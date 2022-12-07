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
  if (d.size === undefined) d.size = d.children.reduce((p, c) => p + calcSize(c), 0);
  return d.size;
}

const sumSizesLessThan = (d: DirEntry, maxSize: number): number => {
  if (d.type === 'f') return 0;  
  return (d.size <= maxSize ? d.size : 0) + d.children
    .filter(e => e.type === 'd')
    .reduce((p, c) => p + sumSizesLessThan(c, maxSize), 0);
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
      if (cwd.at(-1).name !== '/') cwd.pop();
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

  while (cwd.length > 1) cwd.pop();

  // Determine dir-sizes
  calcSize(cwd[0]);

  return sumSizesLessThan(cwd[0], 100000);
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
