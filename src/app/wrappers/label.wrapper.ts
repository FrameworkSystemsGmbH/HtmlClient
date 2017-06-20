import { ComponentRef, ViewContainerRef } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { LabelComponent } from '../controls';
import { ControlType } from '../enums';
import { PropertyLayer } from '../common';

export class LabelWrapper extends BaseWrapper {

  public getCaption(): string {
    return this.propertyStore.getCaption();
  }

  public getComponentRef(): ComponentRef<LabelComponent> {
    return <ComponentRef<LabelComponent>>super.getComponentRef();
  }

  protected getComponent(): LabelComponent {
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

  public createComponent(container: ContainerWrapper): void {

  }

  public updateComponent(): void {

  }

}
