export class Vector<T extends number[]> {
  v: T;

  constructor(v: T) {
    this.v = v;
  }

  add(other: Vector<T>) {
    return new Vector<T>(this.v.map((e, idx) => other.v[idx] + e) as T)
  }

  sub(other: Vector<T>) {
    return new Vector<T>(this.v.map((e, idx) => other.v[idx] - e) as T)
  }

  toString() {
    return this.v.join(',')
  }

  clone() {
    return new Vector<T>([...this.v] as T);
  }
}

export const V2 = {
  of(x: number, y: number) {
    return new Vector<[number, number]>([x, y]);
  }
}