import { ComponentRef } from '@angular/core';

import { ControlType } from '../enums';
import { BaseWrapper } from '.';
import { LabelComponent } from '../controls';

export class LabelWrapper extends BaseWrapper {

  private label: string;

  public getLabel(): string {
    return this.label;
  }

  public setLabel(label: string): void {
    this.label = label;
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
      this.label = dataJson.label;
    }
  }

}
