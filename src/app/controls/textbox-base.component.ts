import { Output, EventEmitter, ElementRef } from '@angular/core';

import { BaseComponent } from './base.component';
import { TextBoxBaseWrapper } from '../wrappers/textbox-base-wrapper';
import { ControlEvent } from '../enums/control-event';
import { LayoutableProperties } from '../layout/layoutable-properties';
import { StyleUtil } from '../util/style-util';
import { ControlVisibility } from '../enums/control-visibility';

export abstract class TextBoxBaseComponent extends BaseComponent {

  @Output() onValidated: EventEmitter<any>;

  protected abstract getInput(): ElementRef;

  public callOnEnter(event: any): void {
    if (this.getWrapper().getIsEditable()) {
      super.callOnEnter(event);
    }

    this.selectAll();
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
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.getFourValue('px',
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.getFourValue('px',
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getFontSize(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

  protected selectAll(): void {
    const input: ElementRef = this.getInput();

    if (input) {
      setTimeout(() => input.nativeElement.select());
    }
  }
}
