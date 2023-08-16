import { ComponentFactory, ComponentRef } from '@angular/core';
import { TextBoxMultilineComponent } from '@app/controls/textboxes/textbox-multiline/textbox-multiline.component';
import { ScrollBars } from '@app/enums/scrollbars';
import { TextBoxType } from '@app/enums/textbox-type';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';

export class TextBoxMultilineWrapper extends TextBoxBaseWrapper {

  protected value: string | null = null;
  protected orgValue: string | null = null;

  public updateFittedHeight(): void {
    this.setFittedContentHeight(null);
  }

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Multiline;
  }

  public getScrollBars(): ScrollBars {
    const scrollBars: ScrollBars | undefined = this.getPropertyStore().getScrollBars();
    return scrollBars ?? ScrollBars.None;
  }

  public getWordWrap(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getWordWrap());
  }

  public getLineHeight(): number {
    return Math.ceilDec(super.getLineHeight() * 1.1, 0);
  }

  public getValue(): string | null {
    return this.value;
  }

  public setValue(value: string | null): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value ?? String.empty();
  }

  protected setValueJson(value: string | null): void {
    const val: string = value ?? String.empty();
    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxMultilineComponent> | null {
    return super.getComponentRef() as ComponentRef<TextBoxMultilineComponent> | null;
  }

  protected getComponent(): TextBoxMultilineComponent | null {
    const compRef: ComponentRef<TextBoxMultilineComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxMultilineComponent> {
    const factory: ComponentFactory<TextBoxMultilineComponent> = this.getResolver().resolveComponentFactory(TextBoxMultilineComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
