import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ButtonComponent } from '@app/controls/buttons/button.component';
import { FocusService } from '@app/services/focus.service';
import * as StyleUtil from '@app/util/style-util';
import { ButtonImageWrapper } from '@app/wrappers/button-image-wrapper';

@Component({
  standalone: true,
  selector: 'hc-btn-image',
  templateUrl: './button-image.component.html',
  styleUrls: ['./button-image.component.scss'],
  imports: [
    CommonModule
  ]
})
export class ButtonImageComponent extends ButtonComponent {

  @ViewChild('button', { static: true })
  public button: ElementRef<HTMLButtonElement> | null = null;

  public currentImageUrl: string | null = null;
  public isHovered: boolean = false;
  public isMouseDown: boolean = false;
  public wasMouseDownOnLeave: boolean = false;
  public textStyle: any;
  public badgeImageSrc: SafeUrl | null = null;

  private readonly _sanatizer: DomSanitizer;

  private _normaleImageUrl: string | null = null;
  private _disabledImageUrl: string | null = null;
  private _mouseOverImageUrl: string | null = null;
  private _pressedImageUrl: string | null = null;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    sanitizer: DomSanitizer
  ) {
    super(cdr, focusService);
    this._sanatizer = sanitizer;
  }

  protected getButton(): ElementRef<HTMLButtonElement> | null {
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

    this.getChangeDetectorRef().detectChanges();
  }

  protected updateData(wrapper: ButtonImageWrapper): void {
    super.updateData(wrapper);
    this._normaleImageUrl = wrapper.getImageUrl();
    this._disabledImageUrl = wrapper.getDisabledImageUrl();
    this._mouseOverImageUrl = wrapper.getMouseOverImageUrl();
    this._pressedImageUrl = wrapper.getPressedImageUrl();
    this.updateImageUrl();

    const badgeImageSrc: string | null = wrapper.getBadgeImageSrc();
    this.badgeImageSrc = badgeImageSrc != null && badgeImageSrc.trim().length > 0 ? this._sanatizer.bypassSecurityTrustUrl(badgeImageSrc) : null;
  }

  protected updateStyles(wrapper: ButtonImageWrapper): void {
    super.updateStyles(wrapper);
    this.textStyle = this.createTextStyle(wrapper);
  }

  protected createTextStyle(wrapper: ButtonImageWrapper): any {
    return StyleUtil.getCaptionAlignStyles(wrapper.getCaptionAlign(), wrapper.getPaddingLeft(), wrapper.getPaddingTop(), wrapper.getPaddingRight(), wrapper.getPaddingBottom());
  }
}
