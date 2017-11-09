import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { BaseWrapper } from './base-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { VariantWrapper } from './variant-wrapper';
import { FormComponent } from '../controls/form/form.component';
import { LayoutablePropertiesScrollable } from 'app/wrappers/layout/layoutable-properties-scrollable';

export class FormWrapper extends ContainerWrapper {

  private id: string;
  private fullName: string;
  private variant: VariantWrapper;

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

  public setJson(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
    if (json.controls && json.controls.length) {
      this.setControlsJson(json.controls, isNew);
    }
  }

  protected setMetaJson(metaJson: any): void {
    this.id = metaJson.id;
    this.fullName = metaJson.fullName;
  }

  protected setControlsJson(controlsJson: any, isNew: boolean): void {
    for (const controlJson of controlsJson) {
      if (isNew) {
        let parent: ContainerWrapper = this;
        if (controlJson.meta.parentName) {
          parent = this.findControlRecursive(controlJson.meta.parentName) as ContainerWrapper;
        }
        const control: BaseWrapper = this.controlsService.createWrapperFromType(controlJson, this, parent);
        // #warning Null-Check only because of CustomControls
        if (control) {
          control.setJson(controlJson, true);
        }
      } else {
        const control: BaseWrapper = this.findControlRecursive(controlJson.meta.name);
        if (control) {
          control.setJson(controlJson, false);
        }
      }
    }
  }

  public setFocusControl(name: string): void {
    const control: BaseWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

  public attachComponentToFrame(vc: ViewContainerRef): void {
    const factory: ComponentFactory<FormComponent> = this.componentFactoryResolver.resolveComponentFactory(FormComponent);
    const comp: ComponentRef<FormComponent> = vc.createComponent(factory);
    const instance: FormComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);

    for (const child of this.controls) {
      child.attachComponent(this);
    }
  }

  public attachComponent(container: ContainerWrapper): void {
    // A form is directly attached to a FrameComponent by calling 'attachComponentToFrame()'
  }

  public createComponent(container: ContainerWrapper): void {
    // A form creates its component directly on the frame's ViewContainerRef in 'attachComponentToFrame()'
  }

  public doLayout(availableWidth: number, availableHeight: number): void {
    // #warning Rework to overlaying scrollbar
    const scrollBarWidth: number = this.controlsService.getScrollBarWidth();

    // Get the absolute minimum width of the form
    const minWidth: number = this.getMinLayoutWidth();

    // Get the minimum height depending on the available width but don't deceed the minimum width
    const minHeight: number = this.getMinLayoutHeight(Math.max(minWidth, availableWidth));

    let resultWidth: number;
    let resultHeight: number;

    let hBarNeeded: boolean = false;
    let vBarNeeded: boolean = false;

    // Check if form fits into the available space vertically
    if (minHeight <= availableHeight) {
      // It fits vertically -> check if it fits horizontally
      if (minWidth <= availableWidth) {
        // it fits horizontally -> no scrollbars needed
        resultWidth = availableWidth;
        resultHeight = availableHeight;
      } else {
        // It does not fit horizontally -> horizontal scrollbar is needed
        hBarNeeded = true;

        // Result width is minWidth because it does not fit horizontally in any case
        resultWidth = minWidth;

        // Calculate the available height with a horizontal scrollbar
        const availabelHeightScroll: number = availableHeight - scrollBarWidth;

        // Check if we need a vertical scrollbar because of the horizontal one
        if (minHeight <= availabelHeightScroll) {
          // No vertical scrollbar needed
          vBarNeeded = false;
          resultHeight = availabelHeightScroll;
        } else {
          // Vertical scrollbar is needed
          vBarNeeded = true;

          // Result height is minHeight because it does not fit vertically in any case
          resultHeight = minHeight;
        }
      }
    } else {
      // It does not fit vertically -> vertical scrollbar is needed
      vBarNeeded = true;

      // Result height is minHeight because it does not fit vertically in any case
      resultHeight = minHeight;

      // Calculate the available width with a vertical scrollbar
      const availableWidthScroll: number = availableWidth - scrollBarWidth;

      // Check if we need a horizontal scrollbar because of the vertical one
      if (minWidth <= availableWidthScroll) {
        // No horizontal scrollbar needed
        hBarNeeded = false;
        resultWidth = availableWidthScroll;
      } else {
        // Horizontal scrollbar is needed
        hBarNeeded = true;

        // Result width is minWidth because it does not fit horizontally in any case
        resultWidth = minWidth;
      }
    }

    const layoutableProperties: LayoutablePropertiesScrollable = this.getLayoutableProperties();
    layoutableProperties.setLayoutWidth(resultWidth);
    layoutableProperties.setLayoutHeight(resultHeight);
    layoutableProperties.setHBarNeeded(hBarNeeded);
    layoutableProperties.setVBarNeeded(vBarNeeded);

    this.getLayout().arrange();
  }
}
