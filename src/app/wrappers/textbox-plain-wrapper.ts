import { ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { TextBoxBaseWrapper, ContainerWrapper } from '.';
import { TextBoxPlainComponent } from '../controls';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  protected value: string;
  protected orgValue: string;

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value;
  }

  protected setValueJson(value: string): void {
    let val: string = value ? value : null;
    val = this.formatService.formatString(val, this.getFormat());
    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxPlainComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxPlainComponent>;
  }

  protected getComponent(): TextBoxPlainComponent {
    let compRef: ComponentRef<TextBoxPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<TextBoxPlainComponent> = cfr.resolveComponentFactory(TextBoxPlainComponent);
    let comp: ComponentRef<TextBoxPlainComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: TextBoxPlainComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}
