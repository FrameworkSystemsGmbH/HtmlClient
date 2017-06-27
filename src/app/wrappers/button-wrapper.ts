import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper, BaseWrapperFitted } from '.';
import { ControlEvent } from '../enums';
import { ButtonComponent } from '../controls';
import { PropertyLayer } from '../common';


export class ButtonWrapper extends BaseWrapperFitted {

  private events: ControlEvent;

  public getCaption(): string {
    return this.propertyStore.getCaption();
  }

  public showCaption(): boolean {
    return this.propertyStore.getShowCaption();
  }

  public getComponentRef(): ComponentRef<ButtonComponent> {
    return <ComponentRef<ButtonComponent>>super.getComponentRef();
  }

  protected getComponent(): ButtonComponent {
    return this.getComponentRef().instance;
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
      this.events &= ControlEvent.Click;
    }
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<ButtonComponent> = cfr.resolveComponentFactory(ButtonComponent);
    let comp: ComponentRef<ButtonComponent> = container.getViewContainerRef().createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);
  }

  public updateComponent(): void {

  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedWidth(this.getBorderThicknessLeft() + this.getPaddingLeft() + this.fontService.measureWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getPaddingRight() + this.getBorderThicknessRight());
    } else {
      this.setFittedWidth(null);
    }
  }

}
