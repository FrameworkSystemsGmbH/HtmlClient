import { Injector } from '@angular/core';

import { LayoutBase } from '../layout';
import { BaseWrapper, FormWrapper, ContainerWrapper } from '.';
import { FontService } from '../services/font.service';

export abstract class BaseWrapperFitted extends BaseWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  protected fontService: FontService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector
  ) {
    super(form, parent, appInjector);
    this.fontService = appInjector.get(FontService);
  }

  public getMinWidth(): number {
    return this.isMinWidthSet() ? super.getMinWidth() : this.fittedWidth;
  }

  public getMinHeight(): number {
    return this.isMinHeightSet() ? super.getMinHeight() : this.fittedHeight;
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
    if (!fittedWidth || fittedWidth <= 0) {
      this.fittedWidth = null;
    } else {
      this.fittedWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + fittedWidth + this.getPaddingRight() + this.getBorderThicknessRight();
    }
  }

  protected setFittedContentHeight(fittedHeight: number): void {
    if (!fittedHeight || fittedHeight <= 0) {
      this.fittedHeight = null;
    } else {
      this.fittedHeight = this.getBorderThicknessTop() + this.getPaddingTop() + fittedHeight + this.getPaddingBottom() + this.getBorderThicknessBottom();
    }
  }

}
