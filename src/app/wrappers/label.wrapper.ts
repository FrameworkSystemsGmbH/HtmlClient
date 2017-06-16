import { ComponentRef, ViewContainerRef } from '@angular/core';

import { BaseWrapper } from '.';
import { LabelComponent } from '../controls';
import { ControlType } from '../enums';
import { PropertyLayer } from '../common';

export class LabelWrapper extends BaseWrapper {

  public getLabel(): string {
    return this.propertyStore.getLabel();
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

    if (dataJson.label) {
      this.propertyStore.setLabel(PropertyLayer.Control, dataJson.label);
    }
  }

  public createComponent(): ComponentRef<LabelComponent> {
    return null;
  }

  public updateComponent(): void {

  }

}
