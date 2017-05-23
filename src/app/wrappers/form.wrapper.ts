import { ComponentRef } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { ControlType } from '../enums';
import { FormComponent } from '../controls';

export class FormWrapper extends ContainerWrapper {

  private title: string;

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  protected getComponentRef(): ComponentRef<FormComponent> {
    return <ComponentRef<FormComponent>>super.getComponentRef();
  }

  protected getComponent(): FormComponent {
    return this.getComponentRef().instance;
  }

  public setJson(controlJson: any, delta: boolean): void {
    super.setJson(controlJson, delta);
    this.setTitle(controlJson.meta.title);
  }

  public setFocusControl(name: string): void {
    let control: BaseWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

}
