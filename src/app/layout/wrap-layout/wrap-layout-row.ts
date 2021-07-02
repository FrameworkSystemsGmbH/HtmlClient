import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class WrapLayoutRow {

  private readonly _wrappers: Array<LayoutableControlWrapper>;
  private readonly _minRowHeight: number;
  private readonly _maxRowHeight: number;

  private _resultRowHeight: number = 0;

  public constructor(
    wrappers: Array<LayoutableControlWrapper>,
    minRowHeight: number,
    maxRowHeight: number
  ) {
    this._wrappers = wrappers;
    this._minRowHeight = minRowHeight;
    this._maxRowHeight = maxRowHeight;
  }

  public getWrappers(): Array<LayoutableControlWrapper> {
    return this._wrappers;
  }

  public getWrapperCount(): number {
    return this._wrappers.length;
  }

  public getMinRowHeight(): number {
    return this._minRowHeight;
  }

  public getMaxRowHeight(): number {
    return this._maxRowHeight;
  }
  public getResultRowHeight(): number {
    return this._resultRowHeight;
  }
  public setResultRowHeight(value: number): void {
    this._resultRowHeight = value;
  }
}
