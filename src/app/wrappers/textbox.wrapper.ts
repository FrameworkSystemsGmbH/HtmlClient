import { ComponentRef, ViewContainerRef } from '@angular/core';

import { BaseWrapper } from '.';
import { TextBoxComponent } from '../controls';
import { ControlEvent } from '../enums';


export class TextBoxWrapper extends BaseWrapper {

  private value: string;
  private orgValue: string;

  private events: ControlEvent;

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public getComponentRef(): ComponentRef<TextBoxComponent> {
    return <ComponentRef<TextBoxComponent>>super.getComponentRef();
  }

  protected getComponent(): TextBoxComponent {
    return this.getComponentRef().instance;
  }

  private hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  public getJson(): any {
    if (!this.hasChanges()) {
      return null;
    }

    let controlJson: any = {
      meta: {
        name: this.getName()
      },
      data: {
        value: this.value
      }
    };

    return controlJson;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.value) {
      this.value = dataJson.value;
      this.orgValue = dataJson.value;
    }
  }

  protected setEventsJson(eventsJson: any): void {
    super.setEventsJson(eventsJson);

    if (!eventsJson) {
      return;
    }

    if (eventsJson.leave) {
      this.events &= ControlEvent.Leave;
    }
  }

  public createComponent(): ComponentRef<TextBoxComponent> {
    return null;
  }

  public updateComponent(): void {

  }

}
