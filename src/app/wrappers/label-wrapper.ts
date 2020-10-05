import { ComponentFactory, ComponentRef } from '@angular/core';
import { PropertyLayer } from '@app/common/property-layer';
import { LabelComponent } from '@app/controls/label/label.component';
import { ControlType } from '@app/enums/control-type';
import { TextAlign } from '@app/enums/text-align';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class LabelWrapper extends FittedWrapper {

  public getControlType(): ControlType {
    return ControlType.Label;
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign = this.getPropertyStore().getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
  }

  public providesControlLabelWrapper(): boolean {
    return false;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.text && dataJson.text.value !== undefined) {
      this.getPropertyStore().setCaption(PropertyLayer.Control, dataJson.text.value != null ? dataJson.text.value : String.empty());
    }
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
    this.setFittedContentWidth(this.getFontService().measureTextWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }
}
