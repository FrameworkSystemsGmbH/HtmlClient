import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { TextBoxMultilineComponent } from 'app/controls/textboxes/textbox-multiline/textbox-multiline.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { TextBoxType } from 'app/enums/textbox-type';
import { ScrollBars } from 'app/enums/scrollbars';

export class TextBoxMultilineWrapper extends TextBoxBaseWrapper {

  protected value: string;
  protected orgValue: string;

  public updateFittedHeight(): void {
    this.setFittedContentHeight(null);
  }

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Multiline;
  }

  public getScrollBars(): ScrollBars {
    const scrollBars: ScrollBars = this.getPropertyStore().getScrollBars();
    return scrollBars != null ? scrollBars : ScrollBars.None;
  }

  public getWordWrap(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getWordWrap());
  }

  public getLineHeight(): number {
    return Math.ceilDec(super.getLineHeight() * 1.1, 0);
  }

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
    const val: string = value != null ? value : String.empty();
    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxMultilineComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxMultilineComponent>;
  }

  protected getComponent(): TextBoxMultilineComponent {
    const compRef: ComponentRef<TextBoxMultilineComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxMultilineComponent> {
    const factory: ComponentFactory<TextBoxMultilineComponent> = this.getResolver().resolveComponentFactory(TextBoxMultilineComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
