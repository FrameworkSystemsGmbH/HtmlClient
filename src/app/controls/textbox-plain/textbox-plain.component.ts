import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, Renderer2, OnDestroy, NgZone } from '@angular/core';
import { jqxInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxinput';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { StyleUtil } from '../../util';
import { TextBoxPlainWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';
import { ControlEvent } from '../../enums';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxBaseComponent implements AfterViewInit, OnDestroy {

  @ViewChild('jqxInput') jqxInput: jqxInputComponent;

  private input: HTMLInputElement;

  private onEnterSub: () => void;
  private onLeaveSub: () => void;

  constructor(private renderer: Renderer2) {
    super();
  }

  public get value(): string {
    return this.getWrapper().getValue();
  }

  public set value(value: string) {
    this.getWrapper().setValue(value);
  }

  public ngAfterViewInit(): void {
    this.jqxInput.createComponent();
    this.input = this.jqxInput.widgetObject.getInstance().element;

    this.onEnterSub = this.renderer.listen(this.input, 'focusin', event => { this.callOnEnter(event); });
    this.onLeaveSub = this.renderer.listen(this.input, 'focusout', event => { this.callOnLeave(event); });
  }

  public ngOnDestroy(): void {
    if (this.onEnterSub) {
      this.onEnterSub();
    }

    if (this.onLeaveSub) {
      this.onLeaveSub();
    }

    super.ngOnDestroy();
  }

  public callOnEnter(event: any): void {
    super.callOnEnter(event);
  }

  public callOnLeave(event: any): void {
    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  public setFocus(): void {
    this.jqxInput.focus();
  }

  public getWrapperStyles(): any {
    let wrapper: TextBoxPlainWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY()
    };

    if (this.input) {
      this.setInputStyles();
    }

    return styles;
  }

  public setInputStyles(): void {
    let wrapper: TextBoxPlainWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    this.renderer.setStyle(this.input, 'box-sizing', 'border-box');
    this.renderer.setStyle(this.input, 'min-width', StyleUtil.getValuePx(0));
    this.renderer.setStyle(this.input, 'min-height', StyleUtil.getValuePx(0));
    this.renderer.setStyle(this.input, 'width', StyleUtil.getValuePx(layoutableProperties.getWidth()));
    this.renderer.setStyle(this.input, 'height', StyleUtil.getValuePx(layoutableProperties.getHeight()));
    this.renderer.setStyle(this.input, 'color', wrapper.getForeColor());
    this.renderer.setStyle(this.input, 'background-color', wrapper.getBackColor());
    this.renderer.setStyle(this.input, 'border-style', 'solid');
    this.renderer.setStyle(this.input, 'border-color', wrapper.getBorderColor());
    this.renderer.setStyle(this.input, 'border-left-width', StyleUtil.getValuePx(wrapper.getBorderThicknessLeft()));
    this.renderer.setStyle(this.input, 'border-right-width', StyleUtil.getValuePx(wrapper.getBorderThicknessRight()));
    this.renderer.setStyle(this.input, 'border-top-width', StyleUtil.getValuePx(wrapper.getBorderThicknessTop()));
    this.renderer.setStyle(this.input, 'border-bottom-width', StyleUtil.getValuePx(wrapper.getBorderThicknessBottom()));
    this.renderer.setStyle(this.input, 'margin-left', StyleUtil.getValuePx(wrapper.getMarginLeft()));
    this.renderer.setStyle(this.input, 'margin-right', StyleUtil.getValuePx(wrapper.getMarginRight()));
    this.renderer.setStyle(this.input, 'margin-top', StyleUtil.getValuePx(wrapper.getMarginTop()));
    this.renderer.setStyle(this.input, 'margin-bottom', StyleUtil.getValuePx(wrapper.getMarginBottom()));
    this.renderer.setStyle(this.input, 'padding-left', StyleUtil.getValuePx(wrapper.getPaddingLeft()));
    this.renderer.setStyle(this.input, 'padding-right', StyleUtil.getValuePx(wrapper.getPaddingRight()));
    this.renderer.setStyle(this.input, 'padding-top', StyleUtil.getValuePx(wrapper.getPaddingTop()));
    this.renderer.setStyle(this.input, 'padding-bottom', StyleUtil.getValuePx(wrapper.getPaddingBottom()));
    this.renderer.setStyle(this.input, 'font-family', wrapper.getFontFamily());
    this.renderer.setStyle(this.input, 'font-size', StyleUtil.getValuePx(wrapper.getFontSize()));
    this.renderer.setStyle(this.input, 'line-height', StyleUtil.getValuePx(wrapper.getFontSize()));
    this.renderer.setStyle(this.input, 'font-weight', wrapper.getFontBold());
    this.renderer.setStyle(this.input, 'font-style', wrapper.getFontItalic());
    this.renderer.setStyle(this.input, 'text-decoration', wrapper.getFontUnderline());
    this.renderer.setStyle(this.input, 'text-align', wrapper.getTextAlign());
  }
}
