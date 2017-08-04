import { Component, ViewChild, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { jqxNumberInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnumberinput';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { StyleUtil } from '../../util';
import { TextBoxNumberWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';
import { TextFormat } from '../../enums';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxBaseComponent implements AfterViewInit, OnDestroy {

  @ViewChild('jqxNumberInput') jqxNumberInput: jqxNumberInputComponent;

  private div: HTMLDivElement;
  private input: HTMLInputElement;

  private onEnterSub: () => void;
  private onLeaveSub: () => void;

  constructor(private renderer: Renderer2) {
    super();
  }

  public ngAfterViewInit(): void {
    this.jqxNumberInput.createComponent(this.getJqxOptions());
    this.div = this.jqxNumberInput.widgetObject.getInstance().element;
    this.input = this.div.querySelector('.jqx-input-content') as HTMLInputElement;

    this.onEnterSub = this.renderer.listen(this.input, 'focusin', event => { this.callOnEnter(event); });
    this.onLeaveSub = this.renderer.listen(this.input, 'focusout', event => { this.callOnLeave(event); });

    this.renderer.removeClass(this.div, 'jqx-rc-all');
    this.renderer.addClass(this.input, 'jqx-rc-all');

    this.updateComponent();
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
    this.updateWrapper();
    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  private getJqxOptions(): jqwidgets.NumberInputOptions {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();

    let options: jqwidgets.NumberInputOptions = {
      inputMode: 'simple',
      digits: Math.max(1, wrapper.getMaxPrec() - wrapper.getMaxScale()),
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    }

    let format: TextFormat = wrapper.getFormat();

    if (format === TextFormat.Decimal) {
      options.decimalDigits = Math.max(0, wrapper.getMaxScale());
    }

    if (format === TextFormat.Integer || format === TextFormat.NegativeInteger || format === TextFormat.PositiveInteger) {
      options.decimalDigits = 0;
    }

    if (format === TextFormat.NegativeInteger) {
      options.max = 0;
    }

    if (format === TextFormat.PositiveInteger) {
      options.min = 0;
    }

    return options;
  }

  private isJqxInputInitialized(): boolean {
    return this.jqxNumberInput && this.jqxNumberInput.widgetObject ? true : false;
  }

  public getWrapper(): TextBoxNumberWrapper {
    return super.getWrapper() as TextBoxNumberWrapper;
  }

  public setFocus(): void {
    this.jqxNumberInput.focus();
  }

  public getWrapperStyles(): any {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY()
    };

    if (this.div) {
      this.setDivStyles();
    }

    if (this.input) {
      this.setInputStyles();
    }

    return styles;
  }

  private setDivStyles(): void {
    this.renderer.setStyle(this.div, 'box-sizing', 'border-box');
    this.renderer.setStyle(this.div, 'width', 'inherit');
    this.renderer.setStyle(this.div, 'height', 'inherit');
    this.renderer.setStyle(this.div, 'border-width', '0px');
    this.renderer.setStyle(this.div, 'background-color', 'transparent');
  }

  public setInputStyles(): void {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
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

  public updateComponent(): void {
    if (this.isJqxInputInitialized()) {
      this.jqxNumberInput.val(this.getWrapper().getValue());
    }
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.jqxNumberInput.val());
  }
}
