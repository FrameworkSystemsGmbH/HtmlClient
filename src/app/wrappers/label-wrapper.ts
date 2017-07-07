import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper, BaseWrapperFitted } from '.';
import { LabelComponent } from '../controls';
import { ControlType, TextAlign } from '../enums';
import { PropertyLayer } from '../common';

export class LabelWrapper extends BaseWrapperFitted {

  public getCaption(): string {
    let caption: string = this.propertyStore.getCaption();
    return caption != null ? caption : null;
  }

  public getTextAlign(): TextAlign {
    let textAlign: TextAlign = this.propertyStore.getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
  }

  public getComponentRef(): ComponentRef<LabelComponent> {
    return <ComponentRef<LabelComponent>>super.getComponentRef();
  }

  protected getComponent(): LabelComponent {
    return this.getComponentRef().instance;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<LabelComponent> = cfr.resolveComponentFactory(LabelComponent);
    let comp: ComponentRef<LabelComponent> = container.getViewContainerRef().createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.fontService.measureWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }
}
