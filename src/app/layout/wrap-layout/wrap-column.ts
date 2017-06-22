import { LayoutableControlWrapper } from '..';

export class WrapColumn {

  private minColumnHeight: number;
  private resultColumnWidth: number;

  constructor(
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

  public setMinColumnHeight(value: number) {
    this.minColumnHeight = value;
  }

  public getResultColumnWidth() {
    return this.resultColumnWidth;
  }

  public setResultColumnWidth(value: number) {
    this.resultColumnWidth = value;
  }
}
