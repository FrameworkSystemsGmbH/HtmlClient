import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { ControlType } from '../enums';
import { FormComponent } from '../controls';
import { ResponseFormDto } from '../communication/response';
import { PropertyLayer } from '../common';

export class FormWrapper extends ContainerWrapper {

  public getTitle(): string {
    return this.propertyStore.getTitle();
  }

  protected getComponentRef(): ComponentRef<FormComponent> {
    return <ComponentRef<FormComponent>>super.getComponentRef();
  }

  protected getComponent(): FormComponent {
    return this.getComponentRef().instance;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public setFocusControl(name: string): void {
    let control: BaseWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

  public attachComponentToFrame(vc: ViewContainerRef): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<FormComponent> = cfr.resolveComponentFactory(FormComponent);
    let comp: ComponentRef<FormComponent> = vc.createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);

    for (let child of this.controls) {
      child.attachComponent(this);
    }
  }

  public attachComponent(container: ContainerWrapper): void {
    // A forms is directly attached to a FrameComponent by calling 'attachComponentToFrame()'
  }

  public updateComponent(): void {

  }

}
