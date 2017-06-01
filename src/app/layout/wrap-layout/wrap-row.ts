import { LayoutControlWrapper } from '..';

export class WrapRow {

  private resultRowHeight: number;

  constructor(
    private wrappers: Array<LayoutControlWrapper>,
    private minRowHeight: number,
    private maxRowHeight: number) { }

  public getWrappers(): Array<LayoutControlWrapper> {
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
