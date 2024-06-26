import { Directive, ElementRef } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import * as StyleUtil from '@app/util/style-util';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';

@Directive()
export abstract class TextBoxComponent extends ControlComponent {

  public readOnlyAttr: boolean | null = null;
  public tabIndexAttr: number | null = null;
  public placeholder: string | null = null;
  public inputStyle: any;

  protected mapEnterToTab(): boolean {
    return true;
  }

  public callCtrlEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.ctrlEnter.emit(event);
    } else {
      this.onAfterEnter();
    }
  }

  public onAfterEnter(): void {
    const input: ElementRef<HTMLElement> | null = this.getInput();

    if (input) {
      setTimeout(() => DomUtil.setSelection(input.nativeElement));
    }
  }

  public callKeyDown(event: KeyboardEvent): void {
    this.getFocusService().setLastKeyEvent(event);

    if (KeyUtil.getKeyString(event) === 'Tab' || KeyUtil.getKeyString(event) === 'Enter' && this.mapEnterToTab()) {
      if (event.shiftKey) {
        this.getWrapper().focusKeyboardPrevious();
      } else {
        this.getWrapper().focusKeyboardNext();
      }

      event.preventDefault();
    }
  }

  public getWrapper(): TextBoxBaseWrapper {
    return super.getWrapper() as TextBoxBaseWrapper;
  }

  protected updateData(wrapper: TextBoxBaseWrapper): void {
    super.updateData(wrapper);
    this.readOnlyAttr = Boolean.nullIfFalse(!this.isEditable);
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;

    const caption: string | null = wrapper.getCaption();

    if (wrapper.getCaptionAsPlaceholder() && caption != null && caption.trim().length > 0) {
      this.placeholder = caption;
    } else {
      this.placeholder = String.empty();
    }
  }

  protected updateStyles(wrapper: TextBoxBaseWrapper): void {
    super.updateStyles(wrapper);
    this.inputStyle = this.createInputStyle(wrapper);
  }

  /** Holt sich für beim Wrapper die layoutable Properties und updated diese.
   * Wird bei jedem ChangeDetectionCycle aufgerufen.
   */
  protected createInputStyle(wrapper: TextBoxBaseWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'min-width.rem': 0,
      'min-height.rem': 0,
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlined),
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
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };
  }

  public getFocusElement(): HTMLElement | null {
    const input: ElementRef<HTMLElement> | null = this.getInput();

    if (input) {
      return input.nativeElement;
    }

    return null;
  }

  protected abstract getInput(): ElementRef<HTMLElement> | null;
}
