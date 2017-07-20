import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { TextBoxBaseWrapper, ContainerWrapper } from '.';
import { TextBoxPlainComponent } from '../controls';
import { ControlEvent, TextAlign, TextFormat } from '../enums';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  protected value: string;
  protected orgValue: string;

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    let textFormat: TextFormat = this.getFormat();

    switch (textFormat) {
      case TextFormat.LowerCase:
        this.value = value ? value.toLowerCase() : value;
        break;
      case TextFormat.UpperCase:
        this.value = value ? value.toUpperCase() : value;
        break;
      default:
        this.value = value;
        break;
    }
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value;
  }

  protected setValueJson(value: string): void {
    let val: string = value ? value : null;

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