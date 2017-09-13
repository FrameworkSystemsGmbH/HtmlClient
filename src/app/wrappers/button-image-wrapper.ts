import { ComponentRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';

import { ContainerWrapper, ButtonBaseWrapper, FormWrapper } from '.';
import { ButtonImageComponent } from '../controls';
import { ContentAlignment } from '../enums';
import { BrokerService } from '../services/broker.service';

export class ButtonImageWrapper extends ButtonBaseWrapper {

  private brokerService: BrokerService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector) {
    super(form, parent, appInjector);
    this.brokerService = appInjector.get(BrokerService);
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

    return this.brokerService.getImageUrl(image);
  }

  public getMouseOverImage(): string {
    return this.propertyStore.getMouseOverImage();
  }

  public getMouseOverImageUrl(): string {
    const image: string = this.getMouseOverImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.brokerService.getImageUrl(image);
  }

  public getDisabledImage(): string {
    return this.propertyStore.getDisabledImage();
  }

  public getDisabledImageUrl(): string {
    const image: string = this.getDisabledImage();

    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    return this.brokerService.getImageUrl(image);
  }

  protected getComponentRef(): ComponentRef<ButtonImageComponent> {
    return super.getComponentRef() as ComponentRef<ButtonImageComponent>;
  }

  protected getComponent(): ButtonImageComponent {
    let compRef: ComponentRef<ButtonImageComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<ButtonImageComponent> = cfr.resolveComponentFactory(ButtonImageComponent);
    let comp: ComponentRef<ButtonImageComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: ButtonImageComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}
