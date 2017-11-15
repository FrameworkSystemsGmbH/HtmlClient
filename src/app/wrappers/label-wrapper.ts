import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { FittedWrapper } from './fitted-wrapper';
import { LabelComponent } from '../controls/label/label.component';
import { TextAlign } from '../enums/text-align';

export class LabelWrapper extends FittedWrapper {

  public getCaption(): string {
    const caption: string = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign = this.getPropertyStore().getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
  }

  protected getComponentRef(): ComponentRef<LabelComponent> {
    return super.getComponentRef() as ComponentRef<LabelComponent>;
  }

  protected getComponent(): LabelComponent {
    const compRef: ComponentRef<LabelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<LabelComponent> {
    const factory: ComponentFactory<LabelComponent> = this.getResolver().resolveComponentFactory(LabelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }
}
