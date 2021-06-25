export class DataListEntry {

  private readonly _pk: string;
  private readonly _value: string;

  public constructor(pk: string, value: string) {
    this._pk = pk;
    this._value = value;
  }

  public getPk(): string {
    return this._pk;
  }

  public getValue(): string {
    return this._value;
  }

  public isNullEntry(): boolean {
    return !this._pk || !this._value;
  }
}
