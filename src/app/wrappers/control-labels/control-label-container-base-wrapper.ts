import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { ControlLabelContainerComponent } from '@app/controls/control-labels/control-label-container/control-label-container.component';
import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { TextAlign } from '@app/enums/text-align';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { ControlLabelContainerSingleLayout } from '@app/layout/control-label-container-layout/control-label-container-single-layout';
import { IControlLabelContainer } from '@app/layout/control-label-container-layout/control-label-container.interface';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { VchContainer } from '@app/vch/vch-container';
import { VchControl } from '@app/vch/vch-control';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';
import { IControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper.interface';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';

export interface IControlLabelContainerBaseWrapperOptions {
  labelWrappers: Array<ControlLabelWrapper>;
  fieldRowWrp: FieldRowWrapper;
  rowLabelTemplate: ControlLabelTemplate;
}

export abstract class ControlLabelContainerBaseWrapper implements IControlLabelWrapper, IControlLabelContainer, ILayoutableContainerWrapper {

  protected readonly propError: string = 'This property should not get called!';

  private readonly _name: string;
  private readonly _fieldRowWrp: FieldRowWrapper;
  private readonly _rowLabelTemplate: ControlLabelTemplate;
  private readonly _resolver: ComponentFactoryResolver;

  private _vchControl: VchControl | null = null;
  private _layout: LayoutContainerBase | null = null;
  private _layoutableProperties: LayoutableProperties | null = null;
  private _componentRef: ComponentRef<ControlLabelContainerComponent> | null = null;
  private _labelWrappers: Array<ControlLabelWrapper>;


  public constructor(injector: Injector, options: IControlLabelContainerBaseWrapperOptions) {
    this._resolver = injector.get(ComponentFactoryResolver);
    this._labelWrappers = options.labelWrappers;
    this._fieldRowWrp = options.fieldRowWrp;
    this._rowLabelTemplate = options.rowLabelTemplate;
    this._name = this.createName();

    this.setWrappersLabelContainer();
  }

  public isILayoutableContainer(): void {
    // Interface Marker
  }

  public isILayoutableContainerWrapper(): void {
    // Interface Marker
  }

  protected setWrappersLabelContainer(): void {
    this._labelWrappers.forEach(labelWrapper => {
      labelWrapper.setLabelContainer(this);
    });
  }

  protected getResolver(): ComponentFactoryResolver {
    return this._resolver;
  }

  public getFieldRowWrapper(): FieldRowWrapper {
    return this._fieldRowWrp;
  }

  protected getLabelWrappers(): Array<ControlLabelWrapper> {
    return this._labelWrappers;
  }

  protected setLabelWrappers(labelWrappers: Array<ControlLabelWrapper>): void {
    this._labelWrappers = labelWrappers;
  }

  protected getRowLabelTemplate(): ControlLabelTemplate {
    return this._rowLabelTemplate;
  }

  public getVchControl(): VchControl {
    if (!this._vchControl) {
      this._vchControl = this.createVchControl();
    }
    return this._vchControl;
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  protected createVchControl(): VchControl {
    return new VchContainer(this);
  }

  public getLayout(): LayoutContainerBase {
    if (!this._layout) {
      this._layout = this.createLayout();
    }
    return this._layout;
  }

  protected createLayout(): LayoutContainerBase {
    return new ControlLabelContainerSingleLayout(this);
  }

  public getLayoutableProperties(): LayoutableProperties {
    if (!this._layoutableProperties) {
      this._layoutableProperties = this.createLayoutableProperties();
    }
    return this._layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutableProperties {
    return new LayoutableProperties(this);
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this._labelWrappers;
  }

  protected getComponentRef(): ComponentRef<ControlLabelContainerComponent> | null {
    return this._componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelContainerComponent>): void {
    this._componentRef = componentRef;
  }

  protected getComponent(): ControlLabelContainerComponent | null {
    const compRef: ComponentRef<ControlLabelContainerComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public updateComponent(): void {
    const comp: ControlLabelContainerComponent | null = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public updateComponentRecursively(): void {
    this.updateComponent();

    this._labelWrappers.forEach(labelWrp => {
      labelWrp.updateComponentRecursively();
    });
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: ControlLabelContainerComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get ControlLabelContainerComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public getName(): string {
    return this._name;
  }

  public getInvertFlowDirection(): boolean {
    return false;
  }

  public getTextAlign(): TextAlign {
    return this._rowLabelTemplate.getTextAlign();
  }

  public getForeColor(): string {
    throw new Error(this.propError);
  }

  public getBackColor(): string {
    throw new Error(this.propError);
  }

  public getCurrentVisibility(): Visibility {
    return this.getFieldRowWrapper().getCurrentVisibility();
  }

  public onWrapperCaptionChanged(): void {
    // Override in subclasses
  }

  public onWrapperVisibilityChanged(): void {
    // Override in subclasses
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
    return 0;
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
    this.detachComponent();

    // Create the Angular Component
    const compRef: ComponentRef<ControlLabelContainerComponent> = this.createComponent(uiContainer);
    const compInstance: ControlLabelContainerComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);

    this.attachSubComponents(this, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    for (const labelWrapper of this._labelWrappers) {
      labelWrapper.attachComponent(uiContainer, vchContainer);
    }
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ControlLabelContainerComponent> | null = this.getComponentRef();

    if (compRef != null) {
      compRef.destroy();
    }
  }

  public onComponentDestroyed(): void {
    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper | null = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this._componentRef = null;
  }

  public canReceiveFocus(): boolean {
    return false;
  }

  public canReceiveKeyboardFocus(): boolean {
    return false;
  }

  public setFocus(): void {
    // Cannot receive focus
  }

  public findFirstFocusableControlInContainerRecursive(): ILayoutableControlWrapper | null {
    // Cannot receive focus
    return null;
  }

  public findPreviousKeyboardFocusableControlRecursive(): ILayoutableControlWrapper | null {
    // Cannot receive focus
    return null;
  }

  public findNextKeyboardFocusableControlRecursive(): ILayoutableControlWrapper | null {
    // Cannot receive focus
    return null;
  }

  protected abstract createName(): string;
}
