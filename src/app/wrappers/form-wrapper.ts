import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { VariantWrapper } from 'app/wrappers/variant-wrapper';
import { ControlComponent } from 'app/controls/control.component';
import { FormComponent } from 'app/controls/form/form.component';
import { LayoutablePropertiesScrollable } from 'app/wrappers/layout/layoutable-properties-scrollable';
import { JsonUtil } from 'app/util/json-util';
import { ControlType } from 'app/enums/control-type';

export class FormWrapper extends ContainerWrapper {

  private id: string;
  private fullName: string;
  private variant: VariantWrapper;

  public getControlType(): ControlType {
    return ControlType.Form;
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    const title: string = this.getDefaultVariant().getTitle();
    return title ? title : this.fullName;
  }

  private getDefaultVariant(): VariantWrapper {
    if (!this.variant) {
      this.variant = this.controls.filter(wrapper => wrapper instanceof VariantWrapper)[0] as VariantWrapper;
    }
    return this.variant;
  }

  public getLayoutableProperties(): LayoutablePropertiesScrollable {
    return super.getLayoutableProperties() as LayoutablePropertiesScrollable;
  }

  protected createLayoutableProperties(): LayoutablePropertiesScrollable {
    return new LayoutablePropertiesScrollable(this);
  }

  public isCloseIconVisible(): boolean {
    return this.getDefaultVariant().getIsCloseIconVisible();
  }

  public isCloseEventAttached(): boolean {
    return this.getDefaultVariant().isCloseEventAttached();
  }

  protected getComponentRef(): ComponentRef<FormComponent> {
    return super.getComponentRef() as ComponentRef<FormComponent>;
  }

  protected getComponent(): FormComponent {
    const compRef: ComponentRef<FormComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getMetaJson(): any {
    return { id: this.getId() };
  }

  protected setMetaJson(metaJson: any): void {
    this.id = metaJson.id;
    this.fullName = metaJson.fullName;
  }

  public setFocusControl(name: string): void {
    const control: ControlWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent> {
    throw new Error('A form creates its component directly on the frame\'s ViewContainerRef in \'attachComponentToFrame()\'');
  }

  public attachComponentToFrame(vc: ViewContainerRef): void {
    const compFactory: ComponentFactory<FormComponent> = this.getResolver().resolveComponentFactory(FormComponent);
    const compRef: ComponentRef<FormComponent> = compFactory.create(vc.injector);
    const compInstance: FormComponent = compRef.instance;

    this.setComponentRef(compRef);
    compInstance.setWrapper(this);

    this.attachEvents(compInstance);

    for (const child of this.controls) {
      child.attachComponent(this, this);
    }

    vc.insert(compRef.hostView);
  }

  public doLayout(availableWidth: number, availableHeight: number): void {
    // Get the absolute minimum width of the form
    const minWidth: number = this.getMinLayoutWidth();

    // Get the minimum height depending on the available width but don't deceed the minimum width
    const minHeight: number = this.getMinLayoutHeight(Math.max(minWidth, availableWidth));

    let resultWidth: number;
    let resultHeight: number;

    let hBarNeeded: boolean = false;

    if (minWidth < availableWidth) {
      hBarNeeded = false;
      resultWidth = availableWidth;
    } else {
      hBarNeeded = true;
      resultWidth = minWidth;
    }

    if (minHeight < availableHeight) {
      resultHeight = availableHeight;
    } else {
      resultHeight = minHeight;
    }

    const layoutableProperties: LayoutablePropertiesScrollable = this.getLayoutableProperties();
    layoutableProperties.setLayoutWidth(resultWidth);
    layoutableProperties.setLayoutHeight(resultHeight);
    layoutableProperties.setHBarNeeded(hBarNeeded);

    this.getLayout().arrange();
  }

  public getState(): any {
    const json: any = super.getState();

    json.id = this.id;
    json.fullName = this.fullName;

    const controlsJson: Array<any> = new Array<any>();
    this.getControlsState(controlsJson);

    if (!JsonUtil.isEmptyObject(controlsJson)) {
      json.controls = controlsJson;
    }

    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.id = json.id;
    this.fullName = json.fullName;
  }
}
