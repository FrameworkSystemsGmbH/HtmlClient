import { Component, ElementRef, ViewChild } from '@angular/core';

import { ButtonBaseComponent } from '../button-base.component';
import { ButtonImageWrapper } from '../../wrappers';
import { StyleUtil } from '../../util';

@Component({
  selector: 'hc-btn-image',
  templateUrl: './button-image.component.html',
  styleUrls: ['./button-image.component.scss']
})
export class ButtonImageComponent extends ButtonBaseComponent {

  @ViewChild('focus') focus: ElementRef;

  public isFocus: boolean;
  public isHover: boolean;

  public callOnClick(event: any): void {
    super.callOnClick(event);
  }

  public callOnFocus(event: any): void {
    this.isFocus = true;
    super.callOnEnter(event);
  }

  public callOnBlur(event: any): void {
    super.callOnLeave(event);
    this.isFocus = false;
  }

  public callOnMouseEnter(event: any): void {
    this.isHover = true;
  }

  public callOnMouseLeave(event: any): void {
    this.isHover = false;
  }

  public getCaption(): string {
    return super.getCaption();
  }

  public showCaption(): boolean {
    return super.showCaption();
  }

  public getTabStop(): boolean {
    return this.getWrapper().getTabStop();
  }

  public getWrapper(): ButtonImageWrapper {
    return super.getWrapper() as ButtonImageWrapper;
  }

  public getStyles(): any {
    return super.getStyles();
  }

  public getImageUrl(): string {
    const wrapper: ButtonImageWrapper = this.getWrapper();

    let imageUrl: string = '';

    if (!wrapper.getIsEnabled()) {
      imageUrl = wrapper.getDisabledImageUrl();
    } else if (this.isFocus || this.isHover) {
      imageUrl = wrapper.getMouseOverImageUrl();
    } else {
      imageUrl = wrapper.getImageUrl();
    }

    return imageUrl;
  }

  public getTextStyles(): any {
    const wrapper: ButtonImageWrapper = this.getWrapper();
    const styles: any = StyleUtil.getCaptionAlignStyles(wrapper.getCaptionAlign(), wrapper.getPaddingLeft(), wrapper.getPaddingTop(), wrapper.getPaddingRight(), wrapper.getPaddingBottom());
    return styles;
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
