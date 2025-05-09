import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ClientPictureClickEventArgs } from '@app/common/events/eventargs/client-picture-click-eventargs';
import { ControlComponent } from '@app/controls/control.component';
import { ContentAlignment } from '@app/enums/content-alignment';
import { PictureScaleMode } from '@app/enums/picture-scale-mode';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { FocusService } from '@app/services/focus.service';
import * as StyleUtil from '@app/util/style-util';
import { PictureWrapper } from '@app/wrappers/picture-wrapper';

@Component({
    selector: 'hc-pic',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.scss'],
    imports: [
        CommonModule
    ]
})
export class PictureComponent extends ControlComponent {

  @Output()
  public readonly picClick: EventEmitter<ClientPictureClickEventArgs> = new EventEmitter<ClientPictureClickEventArgs>();

  @ViewChild('wrapper')
  public wrapperEl: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('image')
  public imageEl: ElementRef<HTMLImageElement> | null = null;

  public id: string | null = null;
  public label: string | null = null;
  public imageSrc: SafeUrl | null = null;
  public showCaption: boolean = true;

  public wrapperStyle: any;
  public labelStyle: any;
  public imageClass: any;

  private readonly _sanatizer: DomSanitizer;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    sanitizer: DomSanitizer
  ) {
    super(cdr, focusService);
    this._sanatizer = sanitizer;
  }

  public callPicClick(event: MouseEvent, double: boolean): void {
    if (this.getWrapper().hasOnClickEvent()) {
      this.picClick.emit(this.getClickEventArgs(event, double));
    }
  }

  protected getClickEventArgs(event: MouseEvent, double: boolean): ClientPictureClickEventArgs {
    const button: number = event.button;
    const clickCount = double ? 2 : 1;

    let pictureWidth: number = 0;
    let pictureHeight: number = 0;
    let picturePointX: number = 0;
    let picturePointY: number = 0;
    let controlPointX: number = 0;
    let controlPointY: number = 0;

    if (this.wrapperEl != null) {
      pictureWidth = this.wrapperEl.nativeElement.clientWidth;
      pictureHeight = this.wrapperEl.nativeElement.clientHeight;

      const wrapperRect: ClientRect = this.wrapperEl.nativeElement.getBoundingClientRect();

      controlPointX = event.pageX - wrapperRect.left;
      controlPointY = event.pageY - wrapperRect.top;

      if (this.imageEl != null) {
        const imageRect: ClientRect = this.imageEl.nativeElement.getBoundingClientRect();
        picturePointX = event.pageX - imageRect.left;
        picturePointY = event.pageY - imageRect.top;
      }
    }

    return new ClientPictureClickEventArgs(button, clickCount, pictureWidth, pictureHeight, picturePointX, picturePointY, controlPointX, controlPointY);
  }

  public getWrapper(): PictureWrapper {
    return super.getWrapper() as PictureWrapper;
  }

  protected updateData(wrapper: PictureWrapper): void {
    super.updateData(wrapper);

    const imageSrc: string | null = wrapper.getImageSrc();

    this.id = wrapper.getName();
    this.label = wrapper.getCaption();
    this.imageSrc = imageSrc != null && imageSrc.trim().length > 0 ? this._sanatizer.bypassSecurityTrustUrl(imageSrc) : null;
    this.showCaption = wrapper.showCaption();
  }

  protected updateStyles(wrapper: PictureWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
    this.imageClass = this.createImageClass(wrapper);
  }

  protected createWrapperStyle(wrapper: PictureWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'cursor': !this.isEditable ? 'not-allowed' : null
    };
  }

  protected createLabelStyle(wrapper: PictureWrapper): any {
    switch (wrapper.getCaptionAlign()) {
      case ContentAlignment.TopLeft:
        return {
          'top.rem': StyleUtil.pixToRem(wrapper.getPaddingTop()),
          'left.rem': StyleUtil.pixToRem(wrapper.getPaddingLeft())
        };
      case ContentAlignment.TopCenter:
        return {
          'top.rem': StyleUtil.pixToRem(wrapper.getPaddingTop()),
          'left.%': 50,
          'transform': 'translateX(-50%)'
        };
      case ContentAlignment.TopRight:
        return {
          'top.rem': StyleUtil.pixToRem(wrapper.getPaddingTop()),
          'right.rem': StyleUtil.pixToRem(wrapper.getPaddingRight())
        };
      case ContentAlignment.MiddleLeft:
        return {
          'top.%': 50,
          'left.rem': StyleUtil.pixToRem(wrapper.getPaddingLeft()),
          'transform': 'translateY(-50%)'
        };
      case ContentAlignment.MiddleCenter:
        return {
          'top.%': 50,
          'left.%': 50,
          'transform': 'translate(-50%, -50%)'
        };
      case ContentAlignment.MiddleRight:
        return {
          'top.%': 50,
          'right.rem': StyleUtil.pixToRem(wrapper.getPaddingRight()),
          'transform': 'translateY(-50%)'
        };
      case ContentAlignment.BottomLeft:
        return {
          'left.rem': StyleUtil.pixToRem(wrapper.getPaddingLeft()),
          'bottom.rem': StyleUtil.pixToRem(wrapper.getPaddingBottom())
        };
      case ContentAlignment.BottomCenter:
        return {
          'left.%': 50,
          'bottom.rem': StyleUtil.pixToRem(wrapper.getPaddingBottom()),
          'transform': 'translateX(-50%)'
        };
      case ContentAlignment.BottomRight:
        return {
          'right.rem': StyleUtil.pixToRem(wrapper.getPaddingRight()),
          'bottom.rem': StyleUtil.pixToRem(wrapper.getPaddingBottom())
        };
      default:
        return {
          'top.%': 50,
          'left.%': 50,
          'transform': 'translate(-50%, -50%)'
        };
    }
  }

  protected createImageClass(wrapper: PictureWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();

    switch (wrapper.getScaleMode()) {
      case PictureScaleMode.Stretch:
        return 'stretch';
      case PictureScaleMode.Center:
        return 'center';
      case PictureScaleMode.Zoom:
        return layoutWidth >= layoutHeight ? 'zoomwide' : 'zoomnarrow';
      case PictureScaleMode.ZoomCenter:
        return layoutWidth >= layoutHeight ? 'zoomcenterwide' : 'zoomcenternarrow';
      case PictureScaleMode.ScaleDown:
        return 'scaledown';
      case PictureScaleMode.ScaleDownCenter:
        return 'scaledowncenter';
      default:
        return null;
    }
  }
}
