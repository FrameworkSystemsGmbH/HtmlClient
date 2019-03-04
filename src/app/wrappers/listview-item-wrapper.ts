import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';

export class ListViewItemWrapper {

  private _id: string;
  private _values: Array<ListViewItemValueWrapper>;

  private _selected: boolean;
  private _orgSelected: boolean;

  constructor(id: string, values: Array<ListViewItemValueWrapper>) {
    this._id = id;
    this._values = values;
  }

  public getId(): string {
    return this._id;
  }

  public getValues(): Array<ListViewItemValueWrapper> {
    return this._values;
  }

  public getSelected(): boolean {
    return this._selected;
  }

  public hasChanges(): boolean {
    return this._selected !== this._orgSelected;
  }

  public getSelectedJson(): boolean {
    return this._selected;
  }

  public setSelectedJson(selected: boolean): void {
    this._selected = selected;
    this._orgSelected = selected;
  }
}
