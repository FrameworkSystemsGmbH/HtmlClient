import { EventEmitter, Output } from '@angular/core';

import { ControlComponent } from 'app/controls/control.component';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { Visibility } from 'app/enums/visibility';
import { StyleUtil } from 'app/util/style-util';

export abstract class ButtonComponent extends ControlComponent {

  @Output()
  public onClick: EventEmitter<any>;

  public caption: string;
  public showCaption: boolean;
  public isVisible: boolean;
  public tabIndexAttr: number;
  public disabledAttr: boolean;
  public buttonStyle: any;

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

  protected updateProperties(wrapper: ButtonBaseWrapper): void {
    super.updateProperties(wrapper);
    this.caption = wrapper.getCaption();
    this.showCaption = wrapper.showCaption();
    this.isVisible = wrapper.getVisibility() === Visibility.Visible;
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.disabledAttr = Boolean.nullIfFalse(!this.isEditable);
  }

  protected updateStyles(wrapper: ButtonBaseWrapper): void {
    this.buttonStyle = this.createButtonStyle(wrapper);
  }

  protected createButtonStyle(wrapper: ButtonBaseWrapper): any {
    return {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(this.isEditable, wrapper.getBackColor()),
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
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': 'center',
      'display': !this.isVisible ? 'none' : null
    };
  }
}
