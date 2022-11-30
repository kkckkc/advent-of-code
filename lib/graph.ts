export type Edge = { from: string, to: string, weight: number };

export type Graph = Record<string, Edge[]>;

export const GraphFactory = {
  fromList: (edges: Edge[]) => {
    const dest: Graph = {};
    for (const edge of edges) {
      dest[edge.from] = [...(dest[edge.from] ?? []), edge]
    }
    return dest;
  }
}

export const Graphs = {
  reachable: (graph: Graph, start: string, end: string) => {
    const visited = new Set<string>();

    let current = [ start ];
    let c;
    while (c = current.pop()) {
      if (visited.has(c)) continue;
      visited.add(c);
  
      if (c === end) return true;
  
      graph[c]?.forEach(e => current.push(e.to));
    }
  
    return false;  
  }
}