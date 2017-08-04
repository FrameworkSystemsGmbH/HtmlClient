import { ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper, BaseWrapperFitted } from '.';
import { LabelComponent } from '../controls';
import { TextAlign } from '../enums';

export class LabelWrapper extends BaseWrapperFitted {

  public getCaption(): string {
    let caption: string = this.propertyStore.getCaption();
    return caption != null ? caption : null;
  }

  public getTextAlign(): TextAlign {
    let textAlign: TextAlign = this.propertyStore.getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
  }

  protected getComponentRef(): ComponentRef<LabelComponent> {
    return super.getComponentRef() as ComponentRef<LabelComponent>;
  }

  protected getComponent(): LabelComponent {
    let compRef: ComponentRef<LabelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<LabelComponent> = cfr.resolveComponentFactory(LabelComponent);
    let comp: ComponentRef<LabelComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: LabelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }
}
