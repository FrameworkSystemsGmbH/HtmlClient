import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class WrapLayoutColumn {

  private readonly _wrappers: Array<LayoutableControlWrapper>;
  private readonly _minColumnWidth: number;
  private readonly _maxColumnWidth: number;

  private _minColumnHeight: number = 0;
  private _resultColumnWidth: number = 0;

  public constructor(
    wrappers: Array<LayoutableControlWrapper>,
    minColumnWidth: number,
    maxColumnWidth: number
  ) {
    this._wrappers = wrappers;
    this._minColumnWidth = minColumnWidth;
    this._maxColumnWidth = maxColumnWidth;
  }

  public getWrappers(): Array<LayoutableControlWrapper> {
    return this._wrappers;
  }

  public getWrapperCount(): number {
    return this._wrappers.length;
  }

  public getMinColumnWidth(): number {
    return this._minColumnWidth;
  }

  public getMaxColumnWidth(): number {
    return this._maxColumnWidth;
  }

  public getMinColumnHeight(): number {
    return this._minColumnHeight;
  }

  public setMinColumnHeight(value: number): void {
    this._minColumnHeight = value;
  }

  public getResultColumnWidth(): number {
    return this._resultColumnWidth;
  }

  public setResultColumnWidth(value: number): void {
    this._resultColumnWidth = value;
  }
}
