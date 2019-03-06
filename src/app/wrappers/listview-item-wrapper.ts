import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';

export class ListViewItemWrapper {

  private _id: string;
  private _pos: number;
  private _selected: boolean;
  private _selectedOrg: boolean;
  private _values: Array<ListViewItemValueWrapper>;

  private _isNew: boolean;
  private _hasPosChanged: boolean;
  private _hasContentChanged: boolean;

  constructor(id: string, pos: number, values: Array<ListViewItemValueWrapper>) {
    this._id = id;
    this._pos = pos;
    this._values = values;
    this._isNew = true;
  }

  public getId(): string {
    return this._id;
  }

  public getPos(): number {
    return this._pos;
  }

  public getSelected(): boolean {
    return this._selected;
  }

  public setSelected(selected: boolean): void {
    this._selected = selected;
  }

  public getValues(): Array<ListViewItemValueWrapper> {
    return this._values;
  }

  public setPosJson(pos: number): void {
    if (this._pos !== pos) {
      this._hasPosChanged = true;
    }
    this._pos = pos;
  }

  public setSelectedJson(selected: boolean): void {
    if (this._selected !== selected) {
      this._hasContentChanged = true;
    }
    this._selected = selected;
    this._selectedOrg = selected;
  }

  public setValuesJson(values: Array<ListViewItemValueWrapper>): void {
    this._values = values;
    this._hasContentChanged = true;
  }

  public isNew(): boolean {
    return this._isNew;
  }

  public hasPosChanged(): boolean {
    return this._hasPosChanged;
  }

  public hasContentChanged(): boolean {
    return this._hasContentChanged;
  }

  public hasSelectionChanged(): boolean {
    return this._selected !== this._selectedOrg;
  }

  public confirmPosUpdate(): void {
    this._hasPosChanged = false;
  }

  public confirmContentUpdate(): void {
    this._isNew = false;
    this._hasContentChanged = false;
  }
}
