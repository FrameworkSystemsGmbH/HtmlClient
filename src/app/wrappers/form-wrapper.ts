import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { VariantWrapper } from 'app/wrappers/variant-wrapper';
import { ControlComponent } from 'app/controls/control.component';
import { FormComponent } from 'app/controls/form/form.component';
import { LayoutablePropertiesScrollable } from 'app/wrappers/layout/layoutable-properties-scrollable';
import { JsonUtil } from 'app/util/json-util';
import { ControlType } from 'app/enums/control-type';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';

export class FormWrapper extends ContainerWrapper {

  private _id: string;
  private _fullName: string;
  private _closing: boolean;
  private _isModal: boolean;
  private _variant: VariantWrapper;
  private _closeButton: ButtonBaseWrapper;

  public get closing(): boolean {
    return this._closing;
  }

  public set closing(closing: boolean) {
    this._closing = closing;
  }

  public getControlType(): ControlType {
    return ControlType.Form;
  }

  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this._fullName;
  }

  public getTitle(): string {
    const title: string = this.getDefaultVariant().getTitle();
    return title ? title : this._fullName;
  }

  public getIsModal(): boolean {
    return this._isModal;
  }

  public getCloseButton(): ButtonBaseWrapper {
    return this._closeButton;
  }

  private getDefaultVariant(): VariantWrapper {
    if (!this._variant) {
      this._variant = this.controls.filter(wrapper => wrapper instanceof VariantWrapper)[0] as VariantWrapper;
    }
    return this._variant;
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

  public setCloseButtonAction(button: ButtonBaseWrapper): void {
    this._closeButton = button;
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
    this._id = metaJson.id;
    this._fullName = metaJson.fullName;
    this._isModal = metaJson.modal;
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

    json.id = this._id;
    json.fullName = this._fullName;
    json.closing = this._closing;
    json.isModal = this._isModal;

    if (this._closeButton != null) {
      json.closeButton = this._closeButton.getName();
    }

    const controlsJson: Array<any> = new Array<any>();
    this.getControlsState(controlsJson);

    if (!JsonUtil.isEmptyObject(controlsJson)) {
      json.controls = controlsJson;
    }

    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this._id = json.id;
    this._fullName = json.fullName;
    this._closing = json.closing;
    this._isModal = json.isModal;

    if (!String.isNullOrWhiteSpace(json.closeButton)) {
      this._closeButton = this.findControlRecursive(json.closeButton) as ButtonBaseWrapper;
    }
  }
}
