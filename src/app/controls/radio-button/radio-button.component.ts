import { Component, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { RadioButtonWrapper } from 'app/wrappers/radio-button-wrapper';
import { CheckBoxWrapper } from 'app/wrappers/checkbox-wrapper';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-radio',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent extends ControlComponent {

  @ViewChild('input')
  public input: ElementRef;

  @Output()
  public onClick: EventEmitter<any>;

  public id: string;
  public value: string;
  public checkedValue: string;
  public groupName: string;
  public caption: string;
  public disabledAttr: boolean;
  public tabIndexAttr: number;

  public wrapperStyle: any;
  public labelStyle: any;
  public captionStyle: any;

  public callOnClick(event: any): void {
    this.getWrapper().fireValueChanged();
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public getWrapper(): RadioButtonWrapper {
    return super.getWrapper() as RadioButtonWrapper;
  }

  public setWrapper(wrapper: RadioButtonWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnClickEvent()) {
      this.onClick = new EventEmitter<any>();
    }
  }

  protected updateData(wrapper: RadioButtonWrapper): void {
    super.updateData(wrapper);
    this.id = wrapper.getName();
    this.value = wrapper.getValue();
    this.checkedValue = wrapper.getCheckedValue();
    this.groupName = wrapper.getButtonGroupName();
    this.caption = wrapper.getCaption();
    this.disabledAttr = Boolean.nullIfFalse(!this.isEditable);
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
  }

  protected updateStyles(wrapper: CheckBoxWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
    this.captionStyle = this.createCaptionStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: CheckBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutWidth,
      'height.px': layoutHeight,
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
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
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'cursor': !this.isEditable ? 'not-allowed' : null
    };
  }

  protected createLabelStyle(wrapper: CheckBoxWrapper): any {
    return {
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'cursor': !this.isEditable ? 'not-allowed' : 'pointer'
    };
  }

  protected createButtonStyle(wrapper: CheckBoxWrapper): any {
    return {

    };
  }

  protected createCaptionStyle(wrapper: CheckBoxWrapper): any {
    return {
      'padding-left.px': wrapper.getLabelGap()
    };
  }

  protected setFocus(): void {
    if (this.input) {
      this.input.nativeElement.focus();
    }
  }
}
