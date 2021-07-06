import { ComponentFactory, ComponentRef } from '@angular/core';
import { ButtonImageComponent } from '@app/controls/buttons/button-image/button-image.component';
import { ContentAlignment } from '@app/enums/content-alignment';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { ButtonBaseWrapper } from '@app/wrappers/button-base-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class ButtonImageWrapper extends ButtonBaseWrapper {

  private _badgeImageData: string | null = null;
  private _dataSourceType: DataSourceType | null = null;

  public getControlType(): ControlType {
    return ControlType.ImageButton;
  }

  public getCaptionAlign(): ContentAlignment {
    const captionAlign: ContentAlignment | undefined = this.getPropertyStore().getCaptionAlign();
    return captionAlign != null ? captionAlign : ContentAlignment.MiddleCenter;
  }

  public getImage(): string | null {
    const image: string | undefined = this.getPropertyStore().getImage();
    return image != null ? image : null;
  }

  public getImageUrl(): string | null {
    const image: string | null = this.getImage();

    if (image != null && image.trim().length) {
      return this.getImageService().getImageUrl(image);
    }

    return null;
  }

  public getPressedImage(): string | null {
    const pressedImage: string | undefined = this.getPropertyStore().getPressedImage();
    return pressedImage != null ? pressedImage : null;
  }

  public getPressedImageUrl(): string | null {
    const pressedImage: string | null = this.getPressedImage();

    if (pressedImage != null && pressedImage.trim().length) {
      return this.getImageService().getImageUrl(pressedImage);
    }

    return null;
  }

  public getMouseOverImage(): string | null {
    const mouseOverImage: string | undefined = this.getPropertyStore().getMouseOverImage();
    return mouseOverImage != null ? mouseOverImage : null;
  }

  public getMouseOverImageUrl(): string | null {
    const mouseOverImage: string | null = this.getMouseOverImage();

    if (mouseOverImage != null && mouseOverImage.trim().length) {
      return this.getImageService().getImageUrl(mouseOverImage);
    }

    return null;
  }

  public getDisabledImage(): string | null {
    const disabledImage: string | undefined = this.getPropertyStore().getDisabledImage();
    return disabledImage != null ? disabledImage : null;
  }

  public getDisabledImageUrl(): string | null {
    const disabledImage: string | null = this.getDisabledImage();

    if (disabledImage != null && disabledImage.trim().length) {
      return this.getImageService().getImageUrl(disabledImage);
    }

    return null;
  }

  public getBadgeImageSrc(): string | null {
    if (this._badgeImageData != null && this._badgeImageData.trim().length) {
      if (this._dataSourceType === DataSourceType.ByteArray) {
        return `data:;base64,${this._badgeImageData}`;
      } else {
        return this.getImageService().getImageUrl(this._badgeImageData);
      }
    }

    return null;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.badgeImage != null && dataJson.badgeImage.type != null && dataJson.badgeImage.value != null && dataJson.badgeImage.value.trim().length) {
      this._dataSourceType = dataJson.badgeImage.type;
      this._badgeImageData = dataJson.badgeImage.value;
    }
  }

  protected getComponentRef(): ComponentRef<ButtonImageComponent> | null {
    return super.getComponentRef() as ComponentRef<ButtonImageComponent> | null;
  }

  protected getComponent(): ButtonImageComponent | null {
    const compRef: ComponentRef<ButtonImageComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ButtonImageComponent> {
    const factory: ComponentFactory<ButtonImageComponent> = this.getResolver().resolveComponentFactory(ButtonImageComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.type = this._dataSourceType;
    json.badgeImageData = this._badgeImageData;
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this._dataSourceType = json.type;
    this._badgeImageData = json.badgeImageData;
  }
}
