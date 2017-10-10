import { LayoutableControlWrapper } from '../layoutable-control-wrapper';

export class WrapRow {

  private resultRowHeight: number;

  constructor(
    private wrappers: Array<LayoutableControlWrapper>,
    private minRowHeight: number,
    private maxRowHeight: number) { }

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
