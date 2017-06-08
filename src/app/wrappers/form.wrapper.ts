import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { ControlType } from '../enums';
import { FormComponent } from '../controls';
import { ResponseFormDto } from '../communication/response';

export class FormWrapper extends ContainerWrapper {

  private title: string;

  public getTitle(): string {
    return this.title;
  }

  protected getComponentRef(): ComponentRef<FormComponent> {
    return <ComponentRef<FormComponent>>super.getComponentRef();
  }

  protected getComponent(): FormComponent {
    return this.getComponentRef().instance;
  }

  protected getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  protected setMetaJson(json: any): void {
    super.setMetaJson(json);
    this.title = json.title;
  }

  public setFocusControl(name: string): void {
    let control: BaseWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

  public createComponent(): ComponentRef<FormComponent> {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<FormComponent> = cfr.resolveComponentFactory(FormComponent);
    let comp: ComponentRef<FormComponent> = factory.create(this.appInjector);

    comp.instance.setWrapper(this);

    return comp;
  }

  public updateComponent(): void {

  }

}
