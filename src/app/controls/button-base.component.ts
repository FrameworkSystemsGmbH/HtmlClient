import { EventEmitter, Output } from '@angular/core';

import { BaseComponent } from '.';
import { ButtonBaseWrapper } from '../wrappers';
import { StyleUtil } from '../util';
import { ControlEvent } from '../enums';

export abstract class ButtonBaseComponent extends BaseComponent {

  @Output() onClick: EventEmitter<any>;

  public callOnClick(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnClick) {
      this.onClick.emit(event);
    }
  }

  public getWrapper(): ButtonBaseWrapper {
    return super.getWrapper() as ButtonBaseWrapper;
  }

  public setWrapper(wrapper: ButtonBaseWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.getEvents() & ControlEvent.OnClick) {
      this.onClick = new EventEmitter<any>();
    }
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
  }

  public showCaption(): boolean {
    return this.getWrapper().showCaption();
  }

  public getTabStop(): boolean {
    return this.getWrapper().getTabStop();
  }

  public getStyles(): any {
    let wrapper: ButtonBaseWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'color': wrapper.getForeColor(),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-left-width.px': wrapper.getBorderThicknessLeft(),
      'border-right-width.px': wrapper.getBorderThicknessRight(),
      'border-top-width.px': wrapper.getBorderThicknessTop(),
      'border-bottom-width.px': wrapper.getBorderThicknessBottom(),
      'margin-left.px': wrapper.getMarginLeft(),
      'margin-right.px': wrapper.getMarginRight(),
      'margin-top.px': wrapper.getMarginTop(),
      'margin-bottom.px': wrapper.getMarginBottom(),
      'padding-left.px': wrapper.getPaddingLeft(),
      'padding-right.px': wrapper.getPaddingRight(),
      'padding-top.px': wrapper.getPaddingTop(),
      'padding-bottom.px': wrapper.getPaddingBottom(),
      'font-family': wrapper.getFontFamily(),
      'font-size.px': wrapper.getFontSize(),
      'line-height.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': 'center'
    };

    return styles;
  }
}
