import { Injector } from '@angular/core';

import { BaseWrapper } from './base-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { FormWrapper } from './form-wrapper';
import { FontService } from '../services/font.service';
import { PropertyData } from '../common';

export abstract class BaseWrapperFitted extends BaseWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  protected fontService: FontService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    injector: Injector
  ) {
    super(form, parent, controlStyle, injector);
    this.fontService = injector.get(FontService);
  }

  public getMinWidth(): number {
    return Number.zeroIfNull(this.isMinWidthSet() ? super.getMinWidth() : this.fittedWidth);
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.isMinHeightSet() ? super.getMinHeight() : this.fittedHeight);
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

}
