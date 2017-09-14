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

  public isFocused: boolean;
  public isHovered: boolean;
  public isMouseDown: boolean;
  public wasMouseDownOnLeave: boolean;

  public callOnClick(event: any): void {
    super.callOnClick(event);
  }

  public callOnFocus(event: any): void {
    this.isFocused = true;
    super.callOnEnter(event);
  }

  public callOnBlur(event: any): void {
    super.callOnLeave(event);
    this.isFocused = false;
  }

  public callOnMouseEnter(event: MouseEvent): void {
    this.isHovered = true;

    if (event.buttons === 1 && this.wasMouseDownOnLeave) {
      this.isMouseDown = true;
    }
  }

  public callOnMouseLeave(event: MouseEvent): void {
    this.isHovered = false;
    this.isMouseDown = false;
    this.wasMouseDownOnLeave = event.buttons === 1;
  }

  public callOnMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.isMouseDown = true;
    }
  }

  public callOnMouseUp(event: MouseEvent): void {
    this.isMouseDown = false;
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
    } else if (this.isMouseDown) {
      imageUrl = wrapper.getPressedImageUrl();
    } else if (this.isFocused || this.isHovered) {
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
