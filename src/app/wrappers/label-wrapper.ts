import { ComponentRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { BaseWrapperFitted } from './base-wrapper-fitted';
import { LabelComponent } from '../controls/label/label.component';
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
    const factory: ComponentFactory<LabelComponent> = this.componentFactoryResolver.resolveComponentFactory(LabelComponent);
    const comp: ComponentRef<LabelComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: LabelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }
}
