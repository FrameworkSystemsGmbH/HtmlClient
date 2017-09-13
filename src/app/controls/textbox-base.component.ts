import { Output, EventEmitter } from '@angular/core';

import { BaseComponent } from '.';
import { TextBoxBaseWrapper } from '../wrappers';
import { ControlEvent } from '../enums';
import { LayoutableProperties } from '../layout';
import { StyleUtil } from '../util';

export abstract class TextBoxBaseComponent extends BaseComponent {

  @Output() onValidated: EventEmitter<any>;

  public callOnLeave(event: any): void {
    this.callOnValidated(event);
    super.callOnLeave(event);
  }

  public callOnValidated(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnValidated) {
      this.onValidated.emit(event);
    }
  }

  public getWrapper(): TextBoxBaseWrapper {
    return super.getWrapper() as TextBoxBaseWrapper;
  }

  public setWrapper(wrapper: TextBoxBaseWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.getEvents() & ControlEvent.OnValidated) {
      this.onValidated = new EventEmitter<any>();
    }
  }

  public getStyles(): any {
    let wrapper: TextBoxBaseWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
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
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };

    return styles;
  }
}
