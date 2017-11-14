import { ComponentFactoryResolver } from '@angular/core';

import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';
import { IFontService } from '../services/font.service';

import { ControlWrapper } from './control-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { FormWrapper } from './form-wrapper';
import { PropertyData } from '../common/property-data';

export abstract class FittedWrapper extends ControlWrapper {

  private fittedWidth: number;
  private fittedHeight: number;

  protected fontService: IFontService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService
  ) {
    super(form, parent, controlStyle, resolver, eventsService, focusService);
    this.fontService = fontService;
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
