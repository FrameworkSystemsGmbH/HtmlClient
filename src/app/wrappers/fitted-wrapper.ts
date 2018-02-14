import { Injector } from '@angular/core';

import { ControlsService } from 'app/services/controls.service';
import { FontService } from 'app/services/font.service';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { PropertyData } from 'app/common/property-data';

export abstract class FittedWrapper extends ControlWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  private readonly fontService: FontService;

  constructor(
    injector: Injector,
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    controlsService: ControlsService
  ) {
    super(injector, form, parent, controlStyle, controlsService);
    this.fontService = injector.get(FontService);
  }

  protected getFontService(): FontService {
    return this.fontService;
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
