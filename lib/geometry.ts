export type Point = {
  x: number,
  y: number
}

export type Line = {
  start: Point,
  end: Point
}

export type Vector = Point;


export const Lines = {
  make: (s: Point, e: Point) => ({ start: s, end: e }),

  length: (l: Line) => {
    if (l.start.x === l.end.x) return Math.abs(l.start.y - l.end.y);
    if (l.start.y === l.end.y) return Math.abs(l.start.x - l.end.x);
    return Math.sqrt(Math.abs(l.start.y - l.end.y) ** 2 + Math.abs(l.start.x - l.end.x) ** 2);
  },

  intersection: (l1: Line, l2: Line) => {
    const to1 = l1.end;
    const from1 = l1.start;
    const to2 = l2.end;
    const from2 = l2.start;

    const dX: number = to1.x - from1.x;
    const dY: number = to1.y - from1.y;
  
    const determinant: number = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
    if (determinant === 0) return undefined; // parallel lines
  
    const lambda: number = ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
    const gamma: number = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;
  
    // check if there is an intersection
    if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) return undefined;
  
    return {
      x: from1.x + lambda * dX,
      y: from1.y + lambda * dY,
    };
  }
}

export const Points = {
  addVector: (o: Point, v: Vector): Point => {
    return { x: o.x + v.x, y: o.y + v.y}
  },

  origin: (): Point => ({ x: 0, y: 0}),

  manhattanDistance: (p: Point) => Math.abs(p.x) + Math.abs(p.y),

  isOrigin: (p: Point) => p.x === 0 && p.y === 0
}

export const Vectors = {
  parseOrthogonalVector: (s: string): Vector => {
    switch (s[0]) {
      case 'U': return { x: 0, y: Number.parseInt(s.slice(1)) };
      case 'D': return { x: 0, y: -Number.parseInt(s.slice(1)) };
      case 'L': return { x: -Number.parseInt(s.slice(1)), y: 0 };
      case 'R': return { x: Number.parseInt(s.slice(1)), y: 0 };
      default:
        throw new Error(`Unknown direction ${s[0]}`);
    }
  },

  rotate: (v: Vector, theta: number): Vector => {
    const thetaRadians = (theta / 180) * Math.PI;
    return {
      x: v.x * Math.cos(thetaRadians) - v.y * Math.sin(thetaRadians),
      y: v.x * Math.sin(thetaRadians) + v.y * Math.cos(thetaRadians)
    }
  },

  round: (v: Vector): Vector => ({ x: Math.round(v.x), y: Math.round(v.y) })
}


