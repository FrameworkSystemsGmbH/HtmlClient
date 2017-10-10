import { ComponentRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';

import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { ButtonBaseWrapper } from './button-base-wrapper';
import { ButtonImageComponent } from '../controls/button-image/button-image.component';
import { ContentAlignment } from '../enums';
import { PropertyData } from '../common';
import { EventsService } from '../services/events.service';
import { FontService } from '../services/font.service';
import { ImageService } from '../services/image.service';

export class ButtonImageWrapper extends ButtonBaseWrapper {

  private imageService: ImageService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    injector: Injector
  ) {
    super(form, parent, controlStyle, injector);
    this.imageService = injector.get(ImageService);
  }

  public getCaptionAlign(): ContentAlignment {
    const captionAlign: ContentAlignment = this.propertyStore.getCaptionAlign();
    return captionAlign != null ? captionAlign : ContentAlignment.MiddleCenter;
  }

  public getImage(): string {
    return this.propertyStore.getImage();
  }

  public getImageUrl(): string {
    const image: string = this.getImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getPressedImage(): string {
    return this.propertyStore.getPressedImage();
  }

  public getPressedImageUrl(): string {
    const image: string = this.getPressedImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getMouseOverImage(): string {
    return this.propertyStore.getMouseOverImage();
  }

  public getMouseOverImageUrl(): string {
    const image: string = this.getMouseOverImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.imageService.getImageUrl(image);
  }

  public getDisabledImage(): string {
    return this.propertyStore.getDisabledImage();
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
    let compRef: ComponentRef<ButtonImageComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<ButtonImageComponent> = this.resolver.resolveComponentFactory(ButtonImageComponent);
    const comp: ComponentRef<ButtonImageComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: ButtonImageComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}
