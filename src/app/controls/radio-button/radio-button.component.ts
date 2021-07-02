import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import * as StyleUtil from '@app/util/style-util';
import { CheckBoxWrapper } from '@app/wrappers/checkbox-wrapper';
import { RadioButtonWrapper } from '@app/wrappers/radio-button-wrapper';

@Component({
  selector: 'hc-radio',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent extends ControlComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  @Output()
  public readonly radioClick: EventEmitter<void> = new EventEmitter<void>();

  public id: string | null = null;
  public value: string | null = null;
  public checkedValue: string | null = null;
  public caption: string | null = null;
  public disabledAttr: boolean | null = null;
  public tabIndexAttr: number | null = null;
  public groupName: string = String.empty();

  public wrapperStyle: any;
  public labelStyle: any;
  public captionStyle: any;

  public callRadioClick(): void {
    this.getWrapper().fireValueChanged();
    if (this.getWrapper().hasOnClickEvent()) {
      this.radioClick.emit();
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
    const focusElement: HTMLElement | null = this.getFocusElement();
    if (focusElement != null) {
      focusElement.focus();
    }
  }

  public getWrapper(): RadioButtonWrapper {
    return super.getWrapper() as RadioButtonWrapper;
  }

  protected updateData(wrapper: RadioButtonWrapper): void {
    super.updateData(wrapper);
    this.id = wrapper.getName();
    this.value = wrapper.getValue();
    this.checkedValue = wrapper.getCheckedValue();
    this.caption = wrapper.getCaption();
    this.disabledAttr = Boolean.nullIfFalse(!this.isEditable);
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;

    const groupNameVal: string | null = wrapper.getButtonGroupName();
    this.groupName = groupNameVal != null ? groupNameVal : String.empty();
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
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
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
