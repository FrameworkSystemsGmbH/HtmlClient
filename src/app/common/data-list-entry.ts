export class DataListEntry {

  private readonly _pk: string | null;
  private readonly _value: string | null;

  public constructor(pk: string | null, value: string | null) {
    this._pk = pk;
    this._value = value;
  }

  public getPk(): string | null {
    return this._pk;
  }

  public getValue(): string | null {
    return this._value;
  }

  public isNullEntry(): boolean {
    return this._pk == null || this._value == null;
  }
}
