import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';

export class ListViewItemWrapper {

  private _id: string;
  private _pos: number;
  private _posOld: number;
  private _isNew: boolean;
  private _values: Array<ListViewItemValueWrapper>;

  private _selected: boolean;
  private _orgSelected: boolean;

  private _hasUiChanges: boolean;

  constructor(id: string, pos: number, values: Array<ListViewItemValueWrapper>) {
    this._id = id;
    this._pos = pos;
    this._posOld = pos;
    this._isNew = true;
    this._values = values;
  }

  public getId(): string {
    return this._id;
  }

  public getPos(): number {
    return this._pos;
  }

  public hasPosChanged(): boolean {
    return this._pos !== this._posOld;
  }

  public getIsNew(): boolean {
    return this._isNew;
  }

  public getValues(): Array<ListViewItemValueWrapper> {
    return this._values;
  }

  public setValues(values: Array<ListViewItemValueWrapper>): void {
    this._values = values;
    this._hasUiChanges = true;
  }

  public getSelected(): boolean {
    return this._selected;
  }

  public setSelected(selected: boolean): void {
    this._selected = selected;
    this._hasUiChanges = true;
  }

  public getHasUiChanges(): boolean {
    return this._hasUiChanges;
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

  public setPosJson(pos: number): void {
    this._posOld = this._pos;
    this._pos = pos;
  }

  public setUiUpdated(): void {
    this._isNew = false;
    this._hasUiChanges = false;
  }
}
