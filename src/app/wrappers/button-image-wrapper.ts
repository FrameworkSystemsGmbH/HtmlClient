import { ComponentRef, ComponentFactory, Injector } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlsService } from 'app/services/controls.service';
import { ImageService } from 'app/services/image.service';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { ButtonImageComponent } from 'app/controls/button-image/button-image.component';
import { ContentAlignment } from 'app/enums/content-alignment';
import { PropertyData } from 'app/common/property-data';

export class ButtonImageWrapper extends ButtonBaseWrapper {

  private readonly imageService: ImageService;

  constructor(
    injector: Injector,
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    controlsService: ControlsService
  ) {
    super(injector, form, parent, controlStyle, controlsService);
    this.imageService = injector.get(ImageService);
  }

  protected getImageService(): ImageService {
    return this.imageService;
  }

  public getCaptionAlign(): ContentAlignment {
    const captionAlign: ContentAlignment = this.getPropertyStore().getCaptionAlign();
    return captionAlign != null ? captionAlign : ContentAlignment.MiddleCenter;
  }

  public getImage(): string {
    return this.getPropertyStore().getImage();
  }

  public getImageUrl(): string {
    const image: string = this.getImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getPressedImage(): string {
    return this.getPropertyStore().getPressedImage();
  }

  public getPressedImageUrl(): string {
    const image: string = this.getPressedImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getMouseOverImage(): string {
    return this.getPropertyStore().getMouseOverImage();
  }

  public getMouseOverImageUrl(): string {
    const image: string = this.getMouseOverImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getDisabledImage(): string {
    return this.getPropertyStore().getDisabledImage();
  }

  public getDisabledImageUrl(): string {
    const image: string = this.getDisabledImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  protected getComponentRef(): ComponentRef<ButtonImageComponent> {
    return super.getComponentRef() as ComponentRef<ButtonImageComponent>;
  }

  protected getComponent(): ButtonImageComponent {
    const compRef: ComponentRef<ButtonImageComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ButtonImageComponent> {
    const factory: ComponentFactory<ButtonImageComponent> = this.getResolver().resolveComponentFactory(ButtonImageComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
