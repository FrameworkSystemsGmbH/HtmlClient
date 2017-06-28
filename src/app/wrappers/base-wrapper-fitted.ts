import { Injector } from '@angular/core';

import { LayoutBase } from '../layout';
import { FittedLayout } from '../layout/fitted-layout';
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

  protected createLayout(): LayoutBase {
    return new FittedLayout(this);
  }

  public setJson(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  public isMinWidthSet(): boolean {
    return this.getMinWidth() != null;
  }

  public isMinHeightSet(): boolean {
    return this.getMinHeight() != null;
  }

  public getFittedWidth(): number {
    return this.fittedWidth;
  }

  public setFittedWidth(fittedWidth): void {
    this.fittedWidth = fittedWidth;
  }

  public getFittedHeight(): number {
    return this.fittedHeight;
  }

  public setFittedHeight(fittedHeight: number): void {
    this.fittedHeight = fittedHeight;
  }

  public updateFittedWidth(): void {
    this.setFittedWidth(null);
  }

  public updateFittedHeight(): void {
    this.setFittedHeight(this.getBorderThicknessTop() + this.getPaddingTop() + this.getFontSize() + this.getPaddingBottom() + this.getBorderThicknessBottom());
  }

}
