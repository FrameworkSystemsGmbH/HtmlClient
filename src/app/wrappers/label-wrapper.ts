import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper, BaseWrapperFitted } from '.';
import { LabelComponent } from '../controls';
import { ControlType, TextAlign } from '../enums';
import { PropertyLayer } from '../common';

export class LabelWrapper extends BaseWrapperFitted {

  public getCaption(): string {
    return this.propertyStore.getCaption();
  }

  public getTextAlign(): TextAlign {
    return this.propertyStore.getTextAlign();
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

  public updateComponent(): void {

  }

  public updateFittedWidth(): void {
    this.setFittedWidth(this.getBorderThicknessLeft() + this.getPaddingLeft() + this.fontService.measureWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getPaddingRight() + this.getBorderThicknessRight());
  }

}
