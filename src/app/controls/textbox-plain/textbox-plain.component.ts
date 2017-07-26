import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit, Renderer2, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { jqxInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxinput';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { StyleUtil } from '../../util';
import { TextBoxPlainWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';
import { ControlEvent, TextFormat } from '../../enums';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxBaseComponent implements OnInit, OnDestroy {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(
    private renderer: Renderer2,
    private formatService: FormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public onInput(event: any): void {
    this.value = this.formatService.formatString(this.value, this.getWrapper().getFormat());
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

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public getStyles(): any {
    let wrapper: TextBoxPlainWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
      'color': wrapper.getForeColor(),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-left-width.px': wrapper.getBorderThicknessLeft(),
      'border-right-width.px': wrapper.getBorderThicknessRight(),
      'border-top-width.px': wrapper.getBorderThicknessTop(),
      'border-bottom-width.px': wrapper.getBorderThicknessBottom(),
      'margin-left.px': wrapper.getMarginLeft(),
      'margin-right.px': wrapper.getMarginRight(),
      'margin-top.px': wrapper.getMarginTop(),
      'margin-bottom.px': wrapper.getMarginBottom(),
      'padding-left.px': wrapper.getPaddingLeft(),
      'padding-right.px': wrapper.getPaddingRight(),
      'padding-top.px': wrapper.getPaddingTop(),
      'padding-bottom.px': wrapper.getPaddingBottom(),
      'font-family': wrapper.getFontFamily(),
      'font-size.px': wrapper.getFontSize(),
      'line-height.px': wrapper.getFontSize(),
      'font-weight': wrapper.getFontBold(),
      'font-style': wrapper.getFontItalic(),
      'text-decoration': wrapper.getFontUnderline(),
      'text-align': wrapper.getTextAlign()
    };

    return styles;
  }

  public updateComponent(): void {
    this.value = this.getWrapper().getValue();
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }
}
