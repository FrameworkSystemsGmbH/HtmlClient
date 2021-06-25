import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class WrapLayoutColumn {

  private minColumnHeight: number;
  private resultColumnWidth: number;

  public constructor(
    private wrappers: Array<LayoutableControlWrapper>,
    private minColumnWidth: number,
    private maxColumnWidth: number) { }

  public getWrappers(): Array<LayoutableControlWrapper> {
    return this.wrappers;
  }

  public getWrapperCount(): number {
    return this.wrappers.length;
  }

  public getMinColumnWidth(): number {
    return this.minColumnWidth;
  }

  public getMaxColumnWidth(): number {
    return this.maxColumnWidth;
  }

  public getMinColumnHeight(): number {
    return this.minColumnHeight;
  }

  public setMinColumnHeight(value: number): void {
    this.minColumnHeight = value;
  }

  public getResultColumnWidth(): number {
    return this.resultColumnWidth;
  }

  public setResultColumnWidth(value: number): void {
    this.resultColumnWidth = value;
  }
}
