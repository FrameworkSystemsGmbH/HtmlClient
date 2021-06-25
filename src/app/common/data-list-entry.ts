export class DataListEntry {

  private readonly pk: string;
  private readonly value: string;

  public constructor(pk: string, value: string) {
    this.pk = pk;
    this.value = value;
  }

  public getPk(): string {
    return this.pk;
  }

  public getValue(): string {
    return this.value;
  }

  public isNullEntry(): boolean {
    return !this.pk || !this.value;
  }
}
