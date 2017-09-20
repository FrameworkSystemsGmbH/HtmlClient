import { Output, EventEmitter } from '@angular/core';

import { BaseComponent } from '.';
import { TextBoxBaseWrapper } from '../wrappers';
import { ControlEvent, ControlVisibility } from '../enums';
import { LayoutableProperties } from '../layout';
import { StyleUtil } from '../util';

export abstract class TextBoxBaseComponent extends BaseComponent {

  @Output() onValidated: EventEmitter<any>;

  public callOnEnter(event: any): void {
    if (this.getWrapper().getIsEditable()) {
      super.callOnEnter(event);
    }
  }

  public callOnLeave(event: any): void {
    if (this.getWrapper().getIsEditable()) {
      this.callOnValidated(event);
      super.callOnLeave(event);
    }
  }

  public callOnValidated(event: any): void {
    if (this.getWrapper().getIsEditable() && (this.getWrapper().getEvents() & ControlEvent.OnValidated)) {
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

  public getIsReadonly(): boolean {
    return Boolean.nullIfFalse(!this.getWrapper().getIsEditable());
  }

  public getTabStop(): number {
    const wrapper: TextBoxBaseWrapper = this.getWrapper();
    return (wrapper.getIsEditable() && wrapper.getTabStop()) ? null : -1;
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
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }
}
