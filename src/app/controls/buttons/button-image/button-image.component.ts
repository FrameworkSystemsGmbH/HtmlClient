import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ButtonComponent } from '@app/controls/buttons/button.component';
import * as StyleUtil from '@app/util/style-util';
import { ButtonImageWrapper } from '@app/wrappers/button-image-wrapper';

@Component({
  selector: 'hc-btn-image',
  templateUrl: './button-image.component.html',
  styleUrls: ['./button-image.component.scss']
})
export class ButtonImageComponent extends ButtonComponent {

  @ViewChild('button', { static: true })
  public button: ElementRef;

  public currentImageUrl: string;
  public isHovered: boolean;
  public isMouseDown: boolean;
  public wasMouseDownOnLeave: boolean;
  public textStyle: any;
  public badgeImageSrc: SafeUrl;

  private _normaleImageUrl: string;
  private _disabledImageUrl: string;
  private _mouseOverImageUrl: string;
  private _pressedImageUrl: string;

  private _sanatizer: DomSanitizer;

  protected init(): void {
    super.init();
    this._sanatizer = this.getInjector().get(DomSanitizer);
  }

  protected getButton(): ElementRef {
    return this.button;
  }

  public callCtrlEnter(event: FocusEvent): void {
    this.updateImageUrl();
    super.callCtrlEnter(event);
  }

  public callCtrlLeave(event: FocusEvent): void {
    super.callCtrlLeave(event);
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

  public callOnMouseUp(): void {
    this.isMouseDown = false;
    this.updateImageUrl();
  }

  public getWrapper(): ButtonImageWrapper {
    return super.getWrapper() as ButtonImageWrapper;
  }

  protected updateImageUrl(): void {
    this.currentImageUrl = null;

    if (!this.isEditable) {
      this.currentImageUrl = this._disabledImageUrl;
    } else if (this.isMouseDown) {
      this.currentImageUrl = this._pressedImageUrl;
    } else if (this.isFocused || this.isHovered) {
      this.currentImageUrl = this._mouseOverImageUrl;
    } else {
      this.currentImageUrl = this._normaleImageUrl;
    }
  }

  protected updateData(wrapper: ButtonImageWrapper): void {
    super.updateData(wrapper);
    this._normaleImageUrl = wrapper.getImageUrl();
    this._disabledImageUrl = wrapper.getDisabledImageUrl();
    this._mouseOverImageUrl = wrapper.getMouseOverImageUrl();
    this._pressedImageUrl = wrapper.getPressedImageUrl();
    this.updateImageUrl();

    const badgeImageSrc: string = wrapper.getBadgeImageSrc();
    this.badgeImageSrc = !String.isNullOrWhiteSpace(badgeImageSrc) ? this._sanatizer.bypassSecurityTrustUrl(badgeImageSrc) : null;
  }

  protected updateStyles(wrapper: ButtonImageWrapper): void {
    super.updateStyles(wrapper);
    this.textStyle = this.createTextStyle(wrapper);
  }

  protected createTextStyle(wrapper: ButtonImageWrapper): any {
    return StyleUtil.getCaptionAlignStyles(wrapper.getCaptionAlign(), wrapper.getPaddingLeft(), wrapper.getPaddingTop(), wrapper.getPaddingRight(), wrapper.getPaddingBottom());
  }
}
