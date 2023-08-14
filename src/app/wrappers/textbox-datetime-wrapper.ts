import { ComponentFactory, ComponentRef } from '@angular/core';
import { TextBoxDateTimeComponent } from '@app/controls/textboxes/textbox-datetime/textbox-datetime.component';
import { TextBoxType } from '@app/enums/textbox-type';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';
import * as Moment from 'moment-timezone';

export class TextBoxDateTimeWrapper extends TextBoxBaseWrapper {

  protected value: Moment.Moment | null = null;
  protected orgValue: Moment.Moment | null = null;

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Date;
  }

  public getValue(): Moment.Moment | null {
    return this.value;
  }

  public setValue(value: Moment.Moment | null): void {
    this.value = value;
  }

  protected getValueJson(): string {
    if (this.value == null) {
      return String.empty();
    }

    const jsonStr: string | null = this.getDateTimeFormatService().momentToJson(this.value);

    return jsonStr ?? String.empty();
  }

  protected setValueJson(value: string | null): void {
    let val: Moment.Moment | null = null;

    if (value != null && value.trim().length > 0) {
      val = this.getDateTimeFormatService().momentFromJson(value);

      if (!val.isValid()) {
        val = null;
      }
    }

    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxDateTimeComponent> | null {
    return super.getComponentRef() as ComponentRef<TextBoxDateTimeComponent> | null;
  }

  protected getComponent(): TextBoxDateTimeComponent | null {
    const compRef: ComponentRef<TextBoxDateTimeComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxDateTimeComponent> {
    const factory: ComponentFactory<TextBoxDateTimeComponent> = this.getResolver().resolveComponentFactory(TextBoxDateTimeComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
