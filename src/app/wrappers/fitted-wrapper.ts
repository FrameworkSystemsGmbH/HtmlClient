import { ControlWrapper } from '@app/wrappers/control-wrapper';

export abstract class FittedWrapper extends ControlWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  public getMinWidth(): number {
    return Math.max(Number.zeroIfNull(super.getMinWidth()), Number.zeroIfNull(this.fittedWidth));
  }

  public getMinHeight(): number {
    return Math.max(Number.zeroIfNull(super.getMinHeight()), Number.zeroIfNull(this.fittedHeight));
  }

  public setJson(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  protected onWrapperCaptionChanged(): void {
    super.onWrapperCaptionChanged();
    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(this.getFontService().measureTextHeight(this.getFontFamily(), this.getFontSize()));
  }

  protected setFittedContentWidth(fittedWidth: number): void {
    if (fittedWidth == null || fittedWidth <= 0) {
      this.fittedWidth = null;
    } else {
      this.fittedWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + fittedWidth + this.getPaddingRight() + this.getBorderThicknessRight();
    }
  }

  protected setFittedContentHeight(fittedHeight: number): void {
    if (fittedHeight == null || fittedHeight <= 0) {
      this.fittedHeight = null;
    } else {
      this.fittedHeight = this.getBorderThicknessTop() + this.getPaddingTop() + fittedHeight + this.getPaddingBottom() + this.getBorderThicknessBottom();
    }
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.fittedWidth = this.fittedWidth;
    json.fittedHeight = this.fittedHeight;
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this.fittedWidth = json.fittedWidth;
    this.fittedHeight = json.fittedHeight;
  }

  public abstract updateFittedWidth(): void;
}
