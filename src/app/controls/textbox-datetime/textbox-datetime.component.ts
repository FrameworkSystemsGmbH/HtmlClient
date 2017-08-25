import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { TextBoxDateTimeWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';
import { DateFormatService } from '../../services/formatter/date-format.service';
import { StyleUtil } from '../../util';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxBaseComponent implements OnInit {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(private dateFormatService: DateFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public callOnEnter(event: any): void {
    super.callOnEnter(event);
  }

  public callOnLeave(event: any): void {
    if (String.isNullOrWhiteSpace(this.value)) {
      this.value = null;
      this.updateWrapper();
    } else {
      let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
      let formattedValue: string = this.dateFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());

      if (formattedValue == null) {
        this.updateComponent();
      } else {
        this.value = formattedValue;
        this.updateWrapper();
      }
    }

    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  public getWrapper(): TextBoxDateTimeWrapper {
    return super.getWrapper() as TextBoxDateTimeWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public getStyles(): any {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
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
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };

    return styles;
  }

  public updateComponent(): void {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.value = this.dateFormatService.formatDate(wrapper.getValue(), wrapper.getFormat(), wrapper.getFormatPattern())
  }

  private updateWrapper(): void {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.getWrapper().setValue(this.dateFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
