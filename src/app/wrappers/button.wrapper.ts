import { ComponentRef, ViewContainerRef } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { ControlEvent } from '../enums';
import { ButtonComponent } from '../controls';
import { PropertyLayer } from '../common';


export class ButtonWrapper extends BaseWrapper {

  private events: ControlEvent;

  public getLabel(): string {
    return this.propertyStore.getLabel();
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

    if (dataJson.label) {
      this.propertyStore.setLabel(PropertyLayer.Control, dataJson.label);
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

  public attachComponent(container: ContainerWrapper): void {
    super.attachComponent(container);


  }

  public updateComponent(): void {

  }

}
