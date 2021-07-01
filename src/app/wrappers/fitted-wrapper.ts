import { ControlWrapper } from '@app/wrappers/control-wrapper';

export abstract class FittedWrapper extends ControlWrapper {

  private _fittedWidth: number | null = null;
  private _fittedHeight: number | null = null;

  public getMinWidth(): number {
    return Math.max(Number.zeroIfNull(super.getMinWidth()), Number.zeroIfNull(this._fittedWidth));
  }

  public getMinHeight(): number {
    return Math.max(Number.zeroIfNull(super.getMinHeight()), Number.zeroIfNull(this._fittedHeight));
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

  protected setFittedContentWidth(fittedWidth: number | null): void {
    if (fittedWidth == null || fittedWidth <= 0) {
      this._fittedWidth = null;
    } else {
      this._fittedWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + fittedWidth + this.getPaddingRight() + this.getBorderThicknessRight();
    }
  }

  protected setFittedContentHeight(fittedHeight: number | null): void {
    if (fittedHeight == null || fittedHeight <= 0) {
      this._fittedHeight = null;
    } else {
      this._fittedHeight = this.getBorderThicknessTop() + this.getPaddingTop() + fittedHeight + this.getPaddingBottom() + this.getBorderThicknessBottom();
    }
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.fittedWidth = this._fittedWidth;
    json.fittedHeight = this._fittedHeight;
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this._fittedWidth = json.fittedWidth;
    this._fittedHeight = json.fittedHeight;
  }

  public abstract updateFittedWidth(): void;
}
