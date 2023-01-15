interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  add(newValue: T): void;
  get(id: string): T | null;
}

export default class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
  private db: Record<string, T> = {};

  public add(newValue: T): void {
    this.db[newValue.id] = newValue;
  }

  public get(id: string): T | null {
    return this.db[id] || null;
  }
}

// example of usage:

interface SomeRecord extends BaseRecord {
  someNumField: number;
}

const someStuffDB = new InMemoryDatabase<SomeRecord>();

someStuffDB.add({
  id: 'cool id',
  someNumField: 123
});

const data = someStuffDB.get('cool id');