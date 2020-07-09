import { ComponentRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';

import { IControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper.interface';
import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IFieldLayoutSynchronized } from 'app/layout/field-layout/field-layout-synchronized.interface';

import { FontService } from 'app/services/font.service';
import { ControlLabelComponent } from 'app/controls/control-labels/control-label/control-label.component';
import { ControlLabelContainerBaseWrapper } from 'app/wrappers/control-labels/control-label-container-base-wrapper';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { LayoutBase } from 'app/layout/layout-base';
import { ControlLayout } from 'app/layout/control-layout/control-layout';
import { LayoutableProperties } from 'app/wrappers/layout/layoutable-properties-default';
import { VchControl } from 'app/vch/vch-control';
import { TextAlign } from 'app/enums/text-align';
import { Visibility } from 'app/enums/visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class ControlLabelWrapper implements IControlLabelWrapper, IFieldLayoutSynchronized {

  private name: string;
  private displayCaption: string;
  private labelProvider: IControlLabelProvider;
  private labelTemplate: ControlLabelTemplate;
  private vchControl: VchControl;
  private layout: LayoutBase;
  private layoutableProperties: LayoutableProperties;
  private componentRef: ComponentRef<ControlLabelComponent>;
  private labelContainer: ControlLabelContainerBaseWrapper;

  private readonly resolver: ComponentFactoryResolver;
  private readonly fontService: FontService;

  protected fittedWidth: number;
  protected fittedHeight: number;

  constructor(
    injector: Injector,
    labelProvider: IControlLabelProvider
  ) {
    this.name = labelProvider.getName() + '_ControlLabel';
    this.labelProvider = labelProvider;
    this.labelTemplate = labelProvider.getLabelTemplate();
    // tslint:disable-next-line: deprecation
    this.resolver = injector.get(ComponentFactoryResolver);
    this.fontService = injector.get(FontService);

    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  public isIFieldLayoutSynchronized(): void {
    // Interface Marker
  }

  public isSynchronizedHidden(): boolean {
    return !this.getLabelTemplate().getIsVisible();
  }

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  protected getFontService(): FontService {
    return this.fontService;
  }

  protected getLabelProvider(): IControlLabelProvider {
    return this.labelProvider;
  }

  protected getLabelTemplate(): ControlLabelTemplate {
    return this.labelTemplate;
  }

  public getVchControl(): VchControl {
    if (!this.vchControl) {
      this.vchControl = this.createVchControl();
    }
    return this.vchControl;
  }

  protected createVchControl(): VchControl {
    return new VchControl();
  }

  protected getLayout(): LayoutBase {
    if (!this.layout) {
      this.layout = this.createLayout();
    }
    return this.layout;
  }

  protected createLayout(): LayoutBase {
    return new ControlLayout(this);
  }

  public getLayoutableProperties(): LayoutableProperties {
    if (!this.layoutableProperties) {
      this.layoutableProperties = this.createLayoutableProperties();
    }
    return this.layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutableProperties {
    return new LayoutableProperties(this);
  }

  protected getLabelContainer(): ControlLabelContainerBaseWrapper {
    return this.labelContainer;
  }

  public setLabelContainer(labelContainer: ControlLabelContainerBaseWrapper): void {
    this.labelContainer = labelContainer;
  }

  protected getComponentRef(): ComponentRef<ControlLabelComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelComponent>): void {
    this.componentRef = componentRef;
  }

  protected getComponent(): ControlLabelComponent {
    const compRef: ComponentRef<ControlLabelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public updateComponent(): void {
    const comp: ControlLabelComponent = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public updateComponentRecursively(): void {
    this.updateComponent();
  }

  public getName(): string {
    return this.name;
  }

  public getCurrentIsEditable(): boolean {
    return this.getLabelProvider().getCurrentIsEditable();
  }

  public getCaption(): string {
    return this.getLabelProvider().getCaption();
  }

  public getDisplayCaption(): string {
    return !!this.displayCaption ? this.displayCaption : this.getCaption();
  }

  public setDisplayCaption(displayCaption: string): void {
    this.displayCaption = displayCaption;
    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign = this.getLabelTemplate().getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
  }

  public getForeColor(): string {
    const foreColor: string = this.getLabelTemplate().getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string = this.getLabelTemplate().getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
  }

  public getCurrentVisibility(): Visibility {
    if (this.getLabelTemplate().getIsVisible()) {
      return this.getLabelProvider().getCurrentVisibility();
    } else {
      return Visibility.Collapsed;
    }
  }

  public onWrapperVisibilityChanged(): void {
    const labelContainer: ControlLabelContainerBaseWrapper = this.getLabelContainer();
    if (labelContainer) {
      labelContainer.onWrapperVisibilityChanged();
    }
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
    return Math.max(Number.zeroIfNull(this.getLabelTemplate().getMinWidth()), Number.zeroIfNull(this.fittedWidth));
  }

  public getMinHeight(): number {
    return Math.max(Number.zeroIfNull(this.getLabelTemplate().getMinHeight()), Number.zeroIfNull(this.fittedHeight));
  }

  public getMaxWidth(): number {
    return Number.maxIfNull(this.getLabelTemplate().getMaxWidth());
  }

  public getMaxHeight(): number {
    return Number.maxIfNull(this.getLabelTemplate().getMaxHeight());
  }

  public getMarginLeft(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getMarginLeft());
  }

  public getMarginRight(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getMarginRight());
  }

  public getMarginTop(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getMarginTop());
  }

  public getMarginBottom(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getMarginBottom());
  }

  public getPaddingLeft(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getPaddingLeft());
  }

  public getPaddingRight(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getPaddingRight());
  }

  public getPaddingTop(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getPaddingTop());
  }

  public getPaddingBottom(): number {
    return Number.zeroIfNull(this.getLabelTemplate().getPaddingBottom());
  }

  public getInsetsLeft(): number {
    return this.getPaddingLeft() + this.getMarginLeft();
  }

  public getInsetsRight(): number {
    return this.getPaddingRight() + this.getMarginRight();
  }

  public getInsetsTop(): number {
    return this.getPaddingTop() + this.getMarginTop();
  }

  public getInsetsBottom(): number {
    return this.getPaddingBottom() + this.getMarginBottom();
  }

  public getDockItemSize(): number {
    return null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    switch (this.getLabelTemplate().getTextAlign()) {
      case TextAlign.Center:
        return HorizontalAlignment.Center;
      case TextAlign.Right:
        return HorizontalAlignment.Right;
      default:
        return HorizontalAlignment.Left;
    }
  }

  public getVerticalAlignment(): VerticalAlignment {
    return VerticalAlignment.Top;
  }

  public getFontFamily(): string {
    const fontFamily: string = this.getLabelTemplate().getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number = this.getLabelTemplate().getFontSize();
    return fontSize != null ? fontSize : 14;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this.getLabelTemplate().getFontBold());
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this.getLabelTemplate().getFontItalic());
  }

  public getFontUnderline(): boolean {
    return Boolean.falseIfNull(this.getLabelTemplate().getFontUnderline());
  }

  public getLineHeight(): number {
    return this.getFontSize();
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.getFontService().measureTextWidth(this.getDisplayCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(this.getFontSize());
  }

  protected setFittedContentWidth(fittedWidth): void {
    if (fittedWidth == null || fittedWidth <= 0) {
      this.fittedWidth = null;
    } else {
      this.fittedWidth = this.getPaddingLeft() + fittedWidth + this.getPaddingRight();
    }
  }

  protected setFittedContentHeight(fittedHeight: number): void {
    if (fittedHeight == null || fittedHeight <= 0) {
      this.fittedHeight = null;
    } else {
      this.fittedHeight = this.getPaddingTop() + fittedHeight + this.getPaddingBottom();
    }
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlLabelComponent> {
    const factory: ComponentFactory<ControlLabelComponent> = this.getResolver().resolveComponentFactory(ControlLabelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    const oldCompRef: ComponentRef<ControlLabelComponent> = this.getComponentRef();

    if (oldCompRef != null) {
      oldCompRef.destroy();
    }

    // Create the Angular Component
    const compRef: ComponentRef<ControlLabelComponent> = this.createComponent(uiContainer);
    const compInstance: ControlLabelComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Register onDestroy handler of the Angular component
    compRef.onDestroy(this.onComponentDestroyed.bind(this));

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);
  }

  protected onComponentDestroyed(): void {
    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this.componentRef = null;
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
}
