import { ComponentRef } from '@angular/core';

import { ControlEvent } from '../enums';
import { BaseWrapper } from '.';
import { ButtonComponent } from '../controls';


export class ButtonWrapper extends BaseWrapper {

  private label: string;

  private events: ControlEvent;

  public getLabel(): string {
    return this.label;
  }

  public setLabel(label: string): void {
    this.label = label;
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
      this.label = dataJson.label;
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

}
