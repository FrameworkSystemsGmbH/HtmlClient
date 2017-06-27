import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { BaseComponent } from '..';
import { ButtonWrapper } from '../../wrappers';

@Component({
  selector: 'hc-btn',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseComponent {

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('focus') focus: ElementRef;

  public getWrapper(): ButtonWrapper {
    return super.getWrapper() as ButtonWrapper;
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
  }

  public getStyles(): any {
    let wrapper: ButtonWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'background-color': wrapper.getBackgroundColor(),
      'border-left': wrapper.getBorderThicknessLeft() + 'px solid',
      'border-right': wrapper.getBorderThicknessRight() + 'px solid',
      'border-top': wrapper.getBorderThicknessTop() + 'px solid',
      'border-bottom': wrapper.getBorderThicknessBottom() + 'px solid',
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
      'font-weight': wrapper.getFontBold() ? 'bold' : 'normal',
      'font-style': wrapper.getFontItalic() ? 'italic' : 'unset',
      'text-decoration': wrapper.getFontUnderline() ? 'underline' : 'unset'
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
