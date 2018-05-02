import { FontService } from 'app/services/font.service';
import { ControlWrapper } from 'app/wrappers/control-wrapper';

export abstract class FittedWrapper extends ControlWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  private fontService: FontService;

  protected init(): void {
    super.init();
    this.fontService = this.getInjector().get(FontService);
  }

  protected getFontService(): FontService {
    return this.fontService;
  }

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

  public abstract updateFittedWidth(): void;

  public updateFittedHeight(): void {
    this.setFittedContentHeight(this.getFontSize());
  }

  protected setFittedContentWidth(fittedWidth): void {
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

  public getState(): any {
    const json: any = super.getState();
    json.fittedWidth = this.fittedWidth;
    json.fittedHeight = this.fittedHeight;
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.fittedWidth = json.fittedWidth;
    this.fittedHeight = json.fittedHeight;
  }
}
