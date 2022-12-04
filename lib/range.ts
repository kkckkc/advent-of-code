export class Range {
  from: number;
  to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  toString() { return `[${this.from} - ${this.to}]`; }

  covers(other: Range) {
    return other.from >= this.from && other.to <= this.to;
  }

  overlaps(other: Range) {
    return (
      (other.from >= this.from && other.from <= this.to) ||
      (other.to >= this.from && other.to <= this.to) ||
      (this.from >= other.from && this.from <= other.to) ||
      (this.to >= other.from && this.to <= other.to)
    )
  }

  union(other: Range) {
    return new Range(Math.min(this.from, other.from), Math.max(this.to, other.to));
  }

  intersect(other: Range) {
    const from = Math.max(this.from, other.from);
    const to = Math.min(this.to, other.to);
    return new Range(from, to);
  }

  size() {
    return this.to - this.from + 1;
  }
}