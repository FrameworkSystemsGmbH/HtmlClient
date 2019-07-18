import { Component, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';

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

  @ViewChild('input', { static: true })
  public input: ElementRef;

  @Output()
  public onClick: EventEmitter<any>;

  public id: string;
  public value: boolean;
  public caption: string;
  public showCaption: boolean;
  public disabledAttr: boolean;
  public tabIndexAttr: number;

  public wrapperStyle: any;
  public labelStyle: any;
  public captionStyle: any;

  public callOnClick(event: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public callKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab' || event.key === 'Enter') {
      if (event.shiftKey) {
        this.getWrapper().focusKeyboardPrevious();
      } else {
        this.getWrapper().focusKeyboardNext();
      }

      event.preventDefault();
    }
  }

  public onWrapperMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.input.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onLabelMouseDown(event: any): void {
    this.setFocus();
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
    this.disabledAttr = Boolean.nullIfFalse(!this.isEditable);
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.value = wrapper.getValue();
    this.id = wrapper.getName();
  }

  protected updateStyles(wrapper: CheckBoxWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
    this.captionStyle = this.createCaptionStyle(wrapper);

    if (this.input) {
      (this.input.nativeElement as HTMLInputElement).tabIndex = this.tabIndexAttr;
    }
  }

  protected createWrapperStyle(wrapper: CheckBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'cursor': !this.isEditable ? 'not-allowed' : null
    };
  }

  protected createLabelStyle(wrapper: CheckBoxWrapper): any {
    return {
      'cursor': !this.isEditable ? 'not-allowed' : 'pointer'
    };
  }

  protected createCaptionStyle(wrapper: CheckBoxWrapper): any {
    return {
      'padding-left.rem': StyleUtil.pixToRem(wrapper.getLabelGap())
    };
  }

  public setFocus(): void {
    if (this.input) {
      this.input.nativeElement.focus();
    }
  }
}
