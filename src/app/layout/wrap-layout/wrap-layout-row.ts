import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class WrapLayoutRow {

  private _resultRowHeight: number = 0;

  public constructor(
    private readonly _wrappers: Array<LayoutableControlWrapper>,
    private readonly _minRowHeight: number,
    private readonly _maxRowHeight: number) { }

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
