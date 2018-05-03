import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatCheckbox } from '@angular/material';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { CheckBoxWrapper } from 'app/wrappers/checkbox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-chkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckBoxComponent extends ControlComponent {

  @ViewChild('checkBox')
  public checkBox: MatCheckbox;

  @Output()
  public onClick: EventEmitter<any>;

  public value: boolean;
  public caption: string;
  public showCaption: boolean;
  public isEditable: boolean;
  public tabIndexAttr: number;

  public wrapperStyle: any;
  public labelStyle: any;

  public callOnClick(event: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public onWrapperMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.checkBox._inputElement.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onLabelClick(event: any): void {
    this.setFocus();
    if (this.isEditable) {
      this.checkBox.ripple.launch(null);
      this.value = !this.value;
      this.callOnClick(event);
    }
  }

  public getWrapper(): CheckBoxWrapper {
    return super.getWrapper() as CheckBoxWrapper;
  }

  public setWrapper(wrapper: CheckBoxWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnClickEvent()) {
      this.onClick = new EventEmitter<any>();
    }
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  protected updateData(wrapper: CheckBoxWrapper): void {
    super.updateData(wrapper);
    this.caption = wrapper.getCaption();
    this.showCaption = wrapper.showCaption();
    this.isEditable = wrapper.getCurrentIsEditable();
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.value = wrapper.getValue();
  }

  protected updateStyles(wrapper: CheckBoxWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);

    if (this.checkBox) {
      (this.checkBox._inputElement.nativeElement as HTMLInputElement).tabIndex = this.tabIndexAttr;
    }
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
      'cursor': !this.isEditable ? 'not-allowed' : null
    };
  }

  protected createLabelStyle(wrapper: CheckBoxWrapper): any {
    return {
      'padding-left.px': wrapper.getLabelGap(),
      'cursor': !this.isEditable ? 'not-allowed' : 'pointer'
    };
  }

  protected setFocus(): void {
    if (this.checkBox) {
      this.checkBox.focus();
      this.checkBox.ripple.fadeOutAll();
    }
  }
}
