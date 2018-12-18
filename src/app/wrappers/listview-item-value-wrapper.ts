export class ListViewItemValue {

  private index: number;
  private value: string;

  constructor(index: number, value: string) {
    this.index = index;
    this.value = value;
  }

  public getIndex(): number {
    return this.index;
  }

  public getValue(): string {
    return this.value;
  }
}
