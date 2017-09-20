import { EventEmitter, Output } from '@angular/core';

import { BaseComponent } from '.';
import { ButtonBaseWrapper } from '../wrappers';
import { StyleUtil } from '../util';
import { ControlEvent, ControlVisibility } from '../enums';

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

  public getIsDisabled(): boolean {
    return Boolean.nullIfFalse(!this.getWrapper().getIsEditable());
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
  }

  public showCaption(): boolean {
    return this.getWrapper().showCaption();
  }

  public getTabStop(): number {
    const wrapper: ButtonBaseWrapper = this.getWrapper();
    return (wrapper.getIsEditable() && wrapper.getTabStop()) ? null : -1;
  }

  public getStyles(): any {
    let wrapper: ButtonBaseWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.getBorderRadius(wrapper.getBorderRadiusTopLeft(), wrapper.getBorderRadiusTopRight(), wrapper.getBorderRadiusBottomLeft(), wrapper.getBorderRadiusBottomRight()),
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

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }
}
