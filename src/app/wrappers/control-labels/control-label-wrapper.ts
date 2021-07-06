import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { ControlLabelComponent } from '@app/controls/control-labels/control-label/control-label.component';
import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { TextAlign } from '@app/enums/text-align';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { ControlLayout } from '@app/layout/control-layout/control-layout';
import { IFieldLayoutSynchronized } from '@app/layout/field-layout/field-layout-synchronized.interface';
import { LayoutBase } from '@app/layout/layout-base';
import { FontService } from '@app/services/font.service';
import { VchControl } from '@app/vch/vch-control';
import { ControlLabelContainerBaseWrapper } from '@app/wrappers/control-labels/control-label-container-base-wrapper';
import { IControlLabelProvider } from '@app/wrappers/control-labels/control-label-provider.interface';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';
import { IControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper.interface';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';

export class ControlLabelWrapper implements IControlLabelWrapper, IFieldLayoutSynchronized {

  protected fittedWidth: number | null = null;
  protected fittedHeight: number | null = null;

  private readonly _name: string;
  private readonly _labelProvider: IControlLabelProvider;
  private readonly _labelTemplate: ControlLabelTemplate;
  private readonly _fieldRowWrp: FieldRowWrapper;
  private readonly _resolver: ComponentFactoryResolver;
  private readonly _fontService: FontService;

  private _displayCaption: string | null = null;
  private _vchControl: VchControl | null = null;
  private _layout: LayoutBase | null = null;
  private _layoutableProperties: LayoutableProperties | null = null;
  private _componentRef: ComponentRef<ControlLabelComponent> | null = null;
  private _labelContainer: ControlLabelContainerBaseWrapper | null = null;

  public constructor(
    injector: Injector,
    labelProvider: IControlLabelProvider,
    fieldRowWrp: FieldRowWrapper
  ) {
    this._name = `${labelProvider.getName()}_ControlLabel`;
    this._labelProvider = labelProvider;
    this._labelTemplate = labelProvider.getLabelTemplate();
    this._fieldRowWrp = fieldRowWrp;
    this._resolver = injector.get(ComponentFactoryResolver);
    this._fontService = injector.get(FontService);

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
    return this._resolver;
  }

  protected getFontService(): FontService {
    return this._fontService;
  }

  protected getLabelProvider(): IControlLabelProvider {
    return this._labelProvider;
  }

  protected getLabelTemplate(): ControlLabelTemplate {
    return this._labelTemplate;
  }

  public getFieldRowWrapper(): FieldRowWrapper {
    return this._fieldRowWrp;
  }

  public getVchControl(): VchControl {
    if (!this._vchControl) {
      this._vchControl = this.createVchControl();
    }
    return this._vchControl;
  }

  protected createVchControl(): VchControl {
    return new VchControl();
  }

  protected getLayout(): LayoutBase {
    if (!this._layout) {
      this._layout = this.createLayout();
    }
    return this._layout;
  }

  protected createLayout(): LayoutBase {
    return new ControlLayout(this);
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

  protected getLabelContainer(): ControlLabelContainerBaseWrapper | null {
    return this._labelContainer;
  }

  public setLabelContainer(labelContainer: ControlLabelContainerBaseWrapper): void {
    this._labelContainer = labelContainer;
  }

  protected getComponentRef(): ComponentRef<ControlLabelComponent> | null {
    return this._componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelComponent>): void {
    this._componentRef = componentRef;
  }

  protected getComponent(): ControlLabelComponent | null {
    const compRef: ComponentRef<ControlLabelComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public updateComponent(): void {
    const comp: ControlLabelComponent | null = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public updateComponentRecursively(): void {
    this.updateComponent();
  }

  public getName(): string {
    return this._name;
  }

  public getCurrentIsEditable(): boolean {
    return this.getLabelProvider().getCurrentIsEditable();
  }

  public getCaption(): string | null {
    return this.getLabelProvider().getCaption();
  }

  public getDisplayCaption(): string | null {
    return this._displayCaption != null && this._displayCaption.trim().length > 0 ? this._displayCaption : this.getCaption();
  }

  public setDisplayCaption(displayCaption: string | null): void {
    this._displayCaption = displayCaption;
    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  public onWrapperCaptionChanged(): void {
    this.setDisplayCaption(null);

    this.getFieldRowWrapper().optimizeLabels();

    const labelContainer: ControlLabelContainerBaseWrapper | null = this.getLabelContainer();
    if (labelContainer) {
      labelContainer.onWrapperCaptionChanged();
    }
  }

  public getTextAlign(): TextAlign {
    return this.getLabelTemplate().getTextAlign();
  }

  public getForeColor(): string {
    return this.getLabelTemplate().getForeColor();
  }

  public getBackColor(): string {
    return this.getLabelTemplate().getBackColor();
  }

  public getCurrentVisibility(): Visibility {
    if (this.getLabelTemplate().getIsVisible()) {
      return this.getLabelProvider().getCurrentVisibility();
    } else {
      return Visibility.Collapsed;
    }
  }

  public onWrapperVisibilityChanged(): void {
    const labelContainer: ControlLabelContainerBaseWrapper | null = this.getLabelContainer();
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
    return 0;
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
    return this.getLabelTemplate().getFontFamily();
  }

  public getFontSize(): number {
    return this.getLabelTemplate().getFontSize();
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

  protected setFittedContentWidth(fittedWidth: number): void {
    if (fittedWidth <= 0) {
      this.fittedWidth = null;
    } else {
      this.fittedWidth = this.getPaddingLeft() + fittedWidth + this.getPaddingRight();
    }
  }

  protected setFittedContentHeight(fittedHeight: number): void {
    if (fittedHeight <= 0) {
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
    this.detachComponent();

    // Create the Angular Component
    const compRef: ComponentRef<ControlLabelComponent> = this.createComponent(uiContainer);
    const compInstance: ControlLabelComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ControlLabelComponent> | null = this.getComponentRef();

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
}
