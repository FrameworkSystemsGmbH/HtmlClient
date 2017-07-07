import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { jqxDateTimeInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdatetimeinput';

import { BaseComponent } from '..';
import { StyleUtil } from '../../util';
import { TextBoxDateTimeWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends BaseComponent implements AfterViewInit {

  @ViewChild('jqxDateTimeInput') jqxDateTimeInput: jqxDateTimeInputComponent;

  @Output() onLeave: EventEmitter<any> = new EventEmitter<any>();

  private input: HTMLInputElement;

  constructor(private renderer: Renderer2) {
    super();
  }

  public get value(): string {
    return '';
  }

  public set value(value: string) {

  }

  public ngAfterViewInit(): void {
    this.jqxDateTimeInput.createComponent({ width: '120px', height: '18px' });
    this.input = this.jqxDateTimeInput.widgetObject.getInstance().element;
  }

  public getWrapper(): TextBoxDateTimeWrapper {
    return super.getWrapper() as TextBoxDateTimeWrapper;
  }

  public focusLost(event: any): void {
    this.getWrapper().formatValue();
  }

  public callOnLeave(event: any): void {
    this.onLeave.emit(event);
  }

  public setFocus(): void {
    this.jqxDateTimeInput.focus();
  }

  public getWrapperStyles(): any {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY()
    };

    if (this.input) {
      // this.setInputStyles();
    }

    return styles;
  }

  public setInputStyles(): void {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
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
