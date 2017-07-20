import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContainerWrapper, BaseWrapperFitted } from '.';
import { ControlEvent } from '../enums';
import { ButtonComponent } from '../controls';
import { PropertyLayer } from '../common';

export class ButtonWrapper extends BaseWrapperFitted {

  private onClickSub: ISubscription;

  public getCaption(): string {
    let caption: string = this.propertyStore.getCaption();
    return caption != null ? caption : null;
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.propertyStore.getShowCaption());
  }

  protected getComponentRef(): ComponentRef<ButtonComponent> {
    return super.getComponentRef() as ComponentRef<ButtonComponent>;
  }

  protected getComponent(): ButtonComponent {
    let compRef: ComponentRef<ButtonComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.caption) {
      this.propertyStore.setCaption(PropertyLayer.Control, dataJson.caption);
    }
  }

  protected setEventsJson(eventsJson: any): void {
    super.setEventsJson(eventsJson);

    if (!eventsJson) {
      return;
    }

    if (eventsJson.click) {
      this.events |= ControlEvent.OnClick;
    }
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<ButtonComponent> = cfr.resolveComponentFactory(ButtonComponent);
    let comp: ComponentRef<ButtonComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: ButtonComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

  protected attachEvents(instance: ButtonComponent): void {
    super.attachEvents(instance);

    if (this.events & ControlEvent.OnClick) {
      this.onClickSub = instance.onClick.subscribe(event => this.eventsService.fireClick(this.getForm().getId(), this.getName()));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
    } else {
      this.setFittedContentWidth(null);
    }
  }

}
