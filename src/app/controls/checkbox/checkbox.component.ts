import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import * as StyleUtil from '@app/util/style-util';
import { CheckBoxWrapper } from '@app/wrappers/checkbox-wrapper';

@Component({
  selector: 'hc-chkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckBoxComponent extends ControlComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  @Output()
  public readonly boxClick: EventEmitter<void> = new EventEmitter<void>();

  public id: string | null = null;
  public value: boolean = false;
  public caption: string | null = null;
  public showCaption: boolean = true;
  public disabledAttr: boolean | null = null;
  public tabIndexAttr: number | null = null;

  public wrapperStyle: any;
  public labelStyle: any;
  public captionStyle: any;

  public callBoxClick(): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnClickEvent()) {
      this.boxClick.emit();
    }
  }

  public callKeyDown(event: KeyboardEvent): void {
    this.getFocusService().setLastKeyEvent(event);

    if (KeyUtil.getKeyString(event) === 'Tab' || KeyUtil.getKeyString(event) === 'Enter') {
      if (event.shiftKey) {
        this.getWrapper().focusKeyboardPrevious();
      } else {
        this.getWrapper().focusKeyboardNext();
      }

      event.preventDefault();
    }
  }

  public onWrapperMouseDown(event: any): void {
    if (this.input != null && (!event.target || !DomUtil.isDescentantOrSelf(this.input.nativeElement, event.target))) {
      event.preventDefault();
    }
  }

  public onLabelMouseDown(): void {
    const focusEl: HTMLElement | null = this.getFocusElement();
    if (focusEl != null) {
      focusEl.focus();
    }
  }

  public getWrapper(): CheckBoxWrapper {
    return super.getWrapper() as CheckBoxWrapper;
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
  }

  protected createWrapperStyle(wrapper: CheckBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
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

  public getFocusElement(): HTMLElement | null {
    if (this.input) {
      return this.input.nativeElement;
    }

    return null;
  }
}
