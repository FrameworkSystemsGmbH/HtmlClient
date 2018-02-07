import { ElementRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { ControlVisibility } from 'app/enums/control-visibility';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

export abstract class TextBoxComponent extends ControlComponent {

  public callOnEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    } else {
      this.onAfterEnter();
    }
  }

  protected abstract getInput(): ElementRef;

  public getWrapper(): TextBoxBaseWrapper {
    return super.getWrapper() as TextBoxBaseWrapper;
  }

  public getIsReadonly(): boolean {
    return Boolean.nullIfFalse(!this.getWrapper().getIsEditable());
  }

  public getTabStop(): number {
    const wrapper: TextBoxBaseWrapper = this.getWrapper();
    return (wrapper.getIsEditable() && wrapper.getTabStop()) ? null : -1;
  }

  public getStyles(): any {
    const wrapper: TextBoxBaseWrapper = this.getWrapper();
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
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

  public onAfterEnter(): void {
    const input: ElementRef = this.getInput();

    if (input) {
      setTimeout(() => DomUtil.setSelection(input.nativeElement));
    }
  }
}
