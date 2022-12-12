const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const searchShortestPath = (map, rowlen, start, end) => {
  let queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length) {
    const [pos, steps] = queue.shift();
    if (pos === end) return steps;
    queue = queue.concat(
      [rowlen, -rowlen, 1, -1]
        .map(d => d + pos)
        .filter(p => map[p] <= map[pos] + 1)
        .filter(c => !visited.has(c))
        .map(c => (visited.add(c), [c, steps + 1]))
    );
  }
  return Number.MAX_SAFE_INTEGER;
};

const parseMap = ([...input]) => {
  const rowlen = input.indexOf("\n");
  const map = input
    .filter(c => c !== "\n")
    .map(v => v.charCodeAt());

  const [start, end] = ["S", "E"]
    .map(v => v.charCodeAt())
    .map(p => map.findIndex(i => i === p));
  [
    ["a", start],
    ["z", end],
  ].forEach(([c, p]) => (map[p] = c.charCodeAt()));
  return [map, rowlen, start, end];
};

const part1 = input =>
  searchShortestPath(...parseMap(input));

const part2 = input =>
  (([map, rowlen, _, end]) =>
    map
      .map((c, i) => [c, i])
      .filter(([c]) => c === "a".charCodeAt())
      .map(([, start]) =>
        searchShortestPath(map, rowlen, start, end)
      )
      .reduce((min, v) => (min < v ? min : v)))(
    parseMap(input)
  );

console.log(part1(input));
console.log(part2(input));