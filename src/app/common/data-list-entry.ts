export class DataListEntry {

  private readonly _pk: string | null;
  private readonly _value: string | null;
  private readonly _isNullEntry: boolean = false;

  public constructor(pk: string | null, value: string, isNullEntry: boolean) {
    this._pk = pk;
    this._value = value;
    this._isNullEntry = isNullEntry;
  }

  public getJson(): any {
    return {
      pk: this._pk,
      value: this._value
    };
  }

  public getPk(): string | null {
    return this._pk;
  }

  public getValue(): string | null {
    return this._value;
  }

  public isNullEntry(): boolean {
    return this._isNullEntry;
  }
}
