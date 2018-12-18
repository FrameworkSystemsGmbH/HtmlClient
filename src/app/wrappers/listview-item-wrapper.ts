import { ListViewItemValue } from 'app/wrappers/listview-item-value-wrapper';

export class ListViewItemWrapper {

  private id: string;
  private values: Array<ListViewItemValue>;

  constructor(id: string, values: Array<ListViewItemValue>) {
    this.id = id;
    this.values = values;
  }

  public getId(): string {
    return this.id;
  }

  public getValues(): Array<ListViewItemValue> {
    return this.values;
  }
}
