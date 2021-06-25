import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class WrapLayoutRow {

  private resultRowHeight: number;

  public constructor(
    private readonly wrappers: Array<LayoutableControlWrapper>,
    private readonly minRowHeight: number,
    private readonly maxRowHeight: number) { }

  public getWrappers(): Array<LayoutableControlWrapper> {
    return this.wrappers;
  }

  public getWrapperCount(): number {
    return this.wrappers.length;
  }

  public getMinRowHeight(): number {
    return this.minRowHeight;
  }

  public getMaxRowHeight(): number {
    return this.maxRowHeight;
  }
  public getResultRowHeight(): number {
    return this.resultRowHeight;
  }
  public setResultRowHeight(value: number): void {
    this.resultRowHeight = value;
  }
}
