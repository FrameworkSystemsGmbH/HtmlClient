import { EventEmitter, Output } from '@angular/core';

import { ControlComponent } from 'app/controls/control.component';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { ControlVisibility } from 'app/enums/control-visibility';
import { StyleUtil } from 'app/util/style-util';

export abstract class ButtonComponent extends ControlComponent {

  @Output()
  public onClick: EventEmitter<any>;

  public callOnClick(event: any): void {
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public getWrapper(): ButtonBaseWrapper {
    return super.getWrapper() as ButtonBaseWrapper;
  }

  public setWrapper(wrapper: ButtonBaseWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnClickEvent()) {
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
    const wrapper: ButtonBaseWrapper = this.getWrapper();

    const styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
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
      'text-align': 'center'
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }
}