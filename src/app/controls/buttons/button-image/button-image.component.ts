import { Component, ViewChild, ElementRef } from '@angular/core';

import { ButtonComponent } from 'app/controls/buttons/button.component';
import { ButtonImageWrapper } from 'app/wrappers/button-image-wrapper';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-btn-image',
  templateUrl: './button-image.component.html',
  styleUrls: ['./button-image.component.scss']
})
export class ButtonImageComponent extends ButtonComponent {

  @ViewChild('button')
  public button: ElementRef;

  public currentImageUrl: string;
  public isHovered: boolean;
  public isMouseDown: boolean;
  public wasMouseDownOnLeave: boolean;
  public textStyle: any;

  private normaleImageUrl: string;
  private disabledImageUrl: string;
  private mouseOverImageUrl: string;
  private pressedImageUrl: string;

  protected getButton(): ElementRef {
    return this.button;
  }

  public callOnEnter(event: FocusEvent): void {
    this.updateImageUrl();
    super.callOnEnter(event);
  }

  public callOnLeave(event: FocusEvent): void {
    super.callOnLeave(event);
    this.updateImageUrl();
  }

  public callOnMouseEnter(event: MouseEvent): void {
    this.isHovered = true;

    if (event.buttons === 1 && this.wasMouseDownOnLeave) {
      this.isMouseDown = true;
    }

    this.updateImageUrl();
  }

  public callOnMouseLeave(event: MouseEvent): void {
    this.isHovered = false;
    this.isMouseDown = false;
    this.wasMouseDownOnLeave = event.buttons === 1;
    this.updateImageUrl();
  }

  public callOnMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.isMouseDown = true;
      this.updateImageUrl();
    }
  }

  public callOnMouseUp(event: MouseEvent): void {
    this.isMouseDown = false;
    this.updateImageUrl();
  }

  public getWrapper(): ButtonImageWrapper {
    return super.getWrapper() as ButtonImageWrapper;
  }

  protected updateImageUrl(): void {
    this.currentImageUrl = null;

    if (!this.isEditable) {
      this.currentImageUrl = this.disabledImageUrl;
    } else if (this.isMouseDown) {
      this.currentImageUrl = this.pressedImageUrl;
    } else if (this.isFocused || this.isHovered) {
      this.currentImageUrl = this.mouseOverImageUrl;
    } else {
      this.currentImageUrl = this.normaleImageUrl;
    }
  }

  protected updateData(wrapper: ButtonImageWrapper): void {
    super.updateData(wrapper);
    this.normaleImageUrl = wrapper.getImageUrl();
    this.disabledImageUrl = wrapper.getDisabledImageUrl();
    this.mouseOverImageUrl = wrapper.getMouseOverImageUrl();
    this.pressedImageUrl = wrapper.getPressedImageUrl();
    this.updateImageUrl();
  }

  protected updateStyles(wrapper: ButtonImageWrapper): void {
    super.updateStyles(wrapper);
    this.textStyle = this.createTextStyle(wrapper);
  }

  protected createTextStyle(wrapper: ButtonImageWrapper): any {
    return StyleUtil.getCaptionAlignStyles(wrapper.getCaptionAlign(), wrapper.getPaddingLeft(), wrapper.getPaddingTop(), wrapper.getPaddingRight(), wrapper.getPaddingBottom());
  }
}
