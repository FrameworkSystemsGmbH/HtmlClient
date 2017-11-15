// import { ComponentFactoryResolver, ComponentRef, Component } from '@angular/core';

// import { ILayoutableWrapper } from 'app/wrappers/layout/layoutable-wrapper.interface';
// import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';

// import { LayoutBase } from 'app/layout/layout-base';
// import { LayoutableComponent } from 'app/controls/layoutable.component';
// import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
// import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';
// import { ControlLayout } from 'app/layout/control-layout/control-layout';
// import { ContainerWrapper } from 'app/wrappers/container-wrapper';
// import { VchControl } from 'app/vch/vch-control';
// import { PropertyStore } from 'app/common/property-store';
// import { ControlVisibility } from 'app/enums/control-visibility';
// import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
// import { VerticalAlignment } from 'app/enums/vertical-alignment';

// export abstract class LayoutableWrapper implements ILayoutableWrapper {

//   private name: string;
//   private vchControl: VchControl;
//   private propertyStore: PropertyStore;
//   private layout: LayoutBase;
//   private layoutableProperties: LayoutablePropertiesDefault;
//   private labelTemplate: LayoutableControlLabelTemplate;
//   private resolver: ComponentFactoryResolver;
//   private componentRef: ComponentRef<LayoutableComponent>;

//   constructor(resolver: ComponentFactoryResolver) {
//     this.vchControl = new VchControl();
//     this.propertyStore = new PropertyStore();
//   }

//   public getName(): string {
//     return this.name;
//   }

//   protected setName(name: string): void {
//     this.name = name;
//   }

//   protected getPropertyStore(): PropertyStore {
//     return this.propertyStore;
//   }

//   public getVchControl(): VchControl {
//     return this.vchControl;
//   }

//   protected getLayout(): LayoutBase {
//     if (!this.layout) {
//       this.layout = this.createLayout();
//     }
//     return this.layout;
//   }

//   protected createLayout(): LayoutBase {
//     return new ControlLayout(this);
//   }

//   public getLayoutableProperties(): LayoutablePropertiesDefault {
//     if (!this.layoutableProperties) {
//       this.layoutableProperties = this.createLayoutableProperties();
//     }
//     return this.layoutableProperties;
//   }

//   protected createLayoutableProperties(): LayoutablePropertiesDefault {
//     return new LayoutablePropertiesDefault(this);
//   }

//   protected getComponentRef(): ComponentRef<LayoutableComponent> {
//     return this.componentRef;
//   }

//   protected setComponentRef(componentRef: ComponentRef<LayoutableComponent>): void {
//     this.componentRef = componentRef;
//   }

//   protected getComponent(): LayoutableComponent {
//     const compRef: ComponentRef<LayoutableComponent> = this.getComponentRef();
//     return compRef ? compRef.instance : undefined;
//   }

//   protected abstract createComponent(container: ContainerWrapper): LayoutableComponent;

//     public attachComponent(container: ContainerWrapper): void {
//       this.createComponent(container);
//     }

//     protected detachComponent(): void {
//       this.detachEvents();
//       this.detachFromVch();
//       this.componentRef = null;
//     }

//   public getVisibility(): ControlVisibility {
//     const visibility: ControlVisibility = this.getPropertyStore().getVisibility();
//     return visibility != null ? visibility : ControlVisibility.Visible;
//   }

//   public getMinLayoutWidth(): number {
//     return this.getLayout().measureMinWidth();
//   }

//   public getMinLayoutHeight(width: number): number {
//     return this.getLayout().measureMinHeight(width);
//   }

//   public getMaxLayoutWidth(): number {
//     return Number.maxIfNull(this.getMaxWidth());
//   }

//   public getMaxLayoutHeight(): number {
//     return Number.maxIfNull(this.getMaxHeight());
//   }

//   public getMinWidth(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMinWidth());
//   }

//   public isMinWidthSet(): boolean {
//     return this.getPropertyStore().getMinWidth() != null;
//   }

//   public getMinHeight(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMinHeight());
//   }

//   public isMinHeightSet(): boolean {
//     return this.getPropertyStore().getMinHeight() != null;
//   }

//   public getMaxWidth(): number {
//     return Number.maxIfNull(this.getPropertyStore().getMaxWidth());
//   }

//   public isMaxWidthSet(): boolean {
//     return this.getPropertyStore().getMaxWidth() != null;
//   }

//   public getMaxHeight(): number {
//     return Number.maxIfNull(this.getPropertyStore().getMaxHeight());
//   }

//   public isMaxHeightSet(): boolean {
//     return this.getPropertyStore().getMaxHeight() != null;
//   }

//   public getMarginLeft(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMarginLeft());
//   }

//   public getMarginRight(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMarginRight());
//   }

//   public getMarginTop(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMarginTop());
//   }

//   public getMarginBottom(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getMarginBottom());
//   }

//   public getBorderThicknessLeft(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessLeft());
//   }

//   public getBorderThicknessRight(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessRight());
//   }

//   public getBorderThicknessTop(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessTop());
//   }

//   public getBorderThicknessBottom(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessBottom());
//   }

//   public getPaddingLeft(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getPaddingLeft());
//   }

//   public getPaddingRight(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getPaddingRight());
//   }

//   public getPaddingTop(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getPaddingTop());
//   }

//   public getPaddingBottom(): number {
//     return Number.zeroIfNull(this.getPropertyStore().getPaddingBottom());
//   }

//   public getInsetsLeft(): number {
//     return this.getPaddingLeft() + this.getBorderThicknessLeft() + this.getMarginLeft();
//   }

//   public getInsetsRight(): number {
//     return this.getPaddingRight() + this.getBorderThicknessRight() + this.getMarginRight();
//   }

//   public getInsetsTop(): number {
//     return this.getPaddingTop() + this.getBorderThicknessTop() + this.getMarginTop();
//   }

//   public getInsetsBottom(): number {
//     return this.getPaddingBottom() + this.getBorderThicknessBottom() + this.getMarginBottom();
//   }

//   public getDockItemSize(): number {
//     const dockItemSize: number = this.getPropertyStore().getDockItemSize();
//     return dockItemSize != null ? dockItemSize : null;
//   }

//   public getFieldRowSize(): number {
//     const fieldRowSize: number = this.getPropertyStore().getFieldRowSize();
//     return fieldRowSize != null ? fieldRowSize : null;
//   }

//   public getHorizontalAlignment(): HorizontalAlignment {
//     const hAlign: HorizontalAlignment = this.getPropertyStore().getHorizontalAlignment();
//     return hAlign != null ? hAlign : HorizontalAlignment.Stretch;
//   }

//   public getVerticalAlignment(): VerticalAlignment {
//     const vAlign: VerticalAlignment = this.getPropertyStore().getVerticalAlignment();
//     return vAlign != null ? vAlign : VerticalAlignment.Stretch;
//   }

//   public getControlLabel(): ILayoutableWrapper {
//     return null;
//   }

//   public getLabelTemplate(): ILayoutableControlLabelTemplate {
//     if (!this.labelTemplate) {
//       this.labelTemplate = new LayoutableControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.labelTemplate));
//     }
//     return this.labelTemplate;
//   }
// }
