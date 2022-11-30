export class Bag {
    data: Record<string, number>;

    constructor() {
        this.data = {} as any;
    }

    add(entry: string, amount=1) {
        this.data[entry] = (this.data[entry] ?? 0) + amount;
    }

    remove(entry: string, amount=1) {
        this.data[entry] = (this.data[entry] ?? 1) - amount;
    }

    count(entry: string): number {
        return this.data[entry] ?? 0;
    }

    keys(): string[] {
        return Object.keys(this.data);
    }

    entries() {
        return Object.entries(this.data);
    }

    values() {
        return Object.values(this.data);
    }

    merge(other: Bag) {
        other.keys().forEach(k => {
            this.add(k, other.count(k));
        })
    }
}