import { ComponentRef, ComponentFactoryResolver, ComponentFactory, ViewContainerRef } from '@angular/core';

import { IControlLabelContainer } from 'app/layout/control-label-layout/control-label-container.interface';
import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { VchControl } from 'app/vch/vch-control';
import { TextAlign } from 'app/enums/text-align';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { VchContainer } from 'app/vch/vch-container';
import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { ControlLabelContainerComponent } from 'app/controls/control-label-container/control-label-container.component';
import { ControlLabelContainerLayout } from 'app/layout/control-label-layout/control-label-container-layout';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';

export class ControlLabelContainerWrapper implements ILayoutableControlWrapper, IControlLabelContainer {

  private readonly propError: string = 'This property should not get called!';

  private name: string;
  private vchControl: VchControl;
  private layout: LayoutContainerBase;
  private layoutableProperties: LayoutablePropertiesDefault;
  private resolver: ComponentFactoryResolver;
  private componentRef: ComponentRef<ControlLabelContainerComponent>;
  private labelWrappers: Array<ControlLabelWrapper>;
  private rowLabelTemplate: ControlLabelTemplate;

  constructor(
    labelWrapper: ControlLabelWrapper,
    resolver: ComponentFactoryResolver,
    rowLabelTemplate: ControlLabelTemplate
  ) {
    this.labelWrappers = new Array<ControlLabelWrapper>();
    this.resolver = resolver;
    this.rowLabelTemplate = rowLabelTemplate;
    this.name = labelWrapper.getName() + '_ControlLabelContainer';

    this.labelWrappers.push(labelWrapper);
  }

  public getVchControl(): VchControl {
    if (!this.vchControl) {
      this.vchControl = this.createVchControl();
    }
    return this.vchControl;
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  protected createVchControl(): VchControl {
    return new VchContainer(this);
  }

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  public getLayout(): LayoutContainerBase {
    if (!this.layout) {
      this.layout = this.createLayout();
    }
    return this.layout;
  }

  protected createLayout(): LayoutContainerBase {
    return new ControlLabelContainerLayout(this);
  }

  public getLayoutableProperties(): LayoutablePropertiesDefault {
    if (!this.layoutableProperties) {
      this.layoutableProperties = this.createLayoutableProperties();
    }
    return this.layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutablePropertiesDefault {
    return new LayoutablePropertiesDefault(this);
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this.labelWrappers;
  }

  protected getComponentRef(): ComponentRef<ControlLabelContainerComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelContainerComponent>): void {
    this.componentRef = componentRef;
  }

  protected getComponent(): ControlLabelContainerComponent {
    const compRef: ComponentRef<ControlLabelContainerComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getName(): string {
    return this.name;
  }

  public getInvertFlowDirection(): boolean {
    return false;
  }

  public getTextAlign(): TextAlign {
    return this.rowLabelTemplate.getTextAlign();
  }

  public getForeColor(): string {
    throw new Error(this.propError);
  }

  public getBackColor(): string {
    throw new Error(this.propError);
  }

  public getVisibility(): ControlVisibility {
    return ControlVisibility.Visible;
  }

  public getMinLayoutWidth(): number {
    return this.getLayout().measureMinWidth();
  }

  public getMinLayoutHeight(width: number): number {
    return this.getLayout().measureMinHeight(width);
  }

  public getMaxLayoutWidth(): number {
    return this.getLayout().measureMaxWidth();
  }

  public getMaxLayoutHeight(): number {
    return this.getLayout().measureMaxHeight();
  }

  public getMinWidth(): number {
    throw new Error(this.propError);
  }

  public getMinHeight(): number {
    throw new Error(this.propError);
  }

  public getMaxWidth(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  public getMaxHeight(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  public getMarginLeft(): number {
    return 0;
  }

  public getMarginRight(): number {
    return 0;
  }

  public getMarginTop(): number {
    return 0;
  }

  public getMarginBottom(): number {
    return 0;
  }

  public getInsetsLeft(): number {
    throw new Error(this.propError);
  }

  public getInsetsRight(): number {
    throw new Error(this.propError);
  }

  public getInsetsTop(): number {
    throw new Error(this.propError);
  }

  public getInsetsBottom(): number {
    throw new Error(this.propError);
  }

  public getDockItemSize(): number {
    return null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return HorizontalAlignment.Left;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return VerticalAlignment.Top;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlLabelContainerComponent> {
    const factory: ComponentFactory<ControlLabelContainerComponent> = this.getResolver().resolveComponentFactory(ControlLabelContainerComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    const oldCompRef: ComponentRef<ControlLabelContainerComponent> = this.getComponentRef();

    if (oldCompRef != null) {
      oldCompRef.destroy();
    }

    // Create the Angular Component
    const compRef: ComponentRef<ControlLabelContainerComponent> = this.createComponent(uiContainer);
    const compInstance: ControlLabelContainerComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Register onDestroy handler of the Angular component
    compRef.onDestroy(this.detachComponent.bind(this));

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);

    this.attachSubComponents(this, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    for (const labelWrapper of this.labelWrappers) {
      labelWrapper.attachComponent(uiContainer, vchContainer);
    }
  }

  protected detachComponent(): void {
    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this.componentRef = null;
  }
}