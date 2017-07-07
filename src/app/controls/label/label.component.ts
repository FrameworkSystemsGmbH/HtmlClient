import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

import { BaseComponent } from '..';
import { LabelWrapper } from '../../wrappers';
import { StyleUtil } from '../../util';

@Component({
  selector: 'hc-lbl',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent extends BaseComponent {

  @ViewChild('focus') focus: ElementRef;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  public getWrapper(): LabelWrapper {
    return super.getWrapper() as LabelWrapper;
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
  }

  public getTabStop(): boolean {
    return this.getWrapper().getTabStop();
  }

  public getStyles(): any {
    let wrapper: LabelWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
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

  public callOnClick(event: any): void {
    this.onClick.emit(event);
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
