import { ComponentRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';

import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';
import { IFontService } from '../services/font.service';
import { IImageService } from '../services/image.service';

import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { ButtonBaseWrapper } from './button-base-wrapper';
import { ButtonImageComponent } from '../controls/button-image/button-image.component';
import { ContentAlignment } from '../enums/content-alignment';
import { PropertyData } from '../common/property-data';

export class ButtonImageWrapper extends ButtonBaseWrapper {

  private imageService: IImageService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService,
    imageService: IImageService
  ) {
    super(form, parent, controlStyle, resolver, eventsService, focusService, fontService);
    this.imageService = imageService;
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
    const factory: ComponentFactory<ButtonImageComponent> = this.componentFactoryResolver.resolveComponentFactory(ButtonImageComponent);
    const comp: ComponentRef<ButtonImageComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: ButtonImageComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}
