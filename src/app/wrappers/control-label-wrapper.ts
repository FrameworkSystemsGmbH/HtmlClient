import { ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IFontService } from 'app/services/font.service';

import { ControlLabelComponent } from 'app/controls/control-label/control-label.component';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { ControlLayout } from 'app/layout/control-layout/control-layout';
import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';
import { VchControl } from 'app/vch/vch-control';
import { TextAlign } from 'app/enums/text-align';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class ControlLabelWrapper implements ILayoutableControlWrapper {

  private name: string;
  private wrapper: ControlWrapper;
  private labelTemplate: LayoutableControlLabelTemplate;
  private vchControl: VchControl;
  private layout: LayoutBase;
  private layoutableProperties: LayoutablePropertiesDefault;
  private resolver: ComponentFactoryResolver;
  private componentRef: ComponentRef<ControlLabelComponent>;
  private fontService: IFontService;

  private fittedWidth: number;
  private fittedHeight: number;

  constructor(
    wrapper: ControlWrapper,
    resolver: ComponentFactoryResolver,
    fontService: IFontService
  ) {
    this.name = wrapper.getName() + '_ControlLabel';
    this.wrapper = wrapper;
    this.labelTemplate = wrapper.getLabelTemplate();
    this.resolver = resolver;
    this.fontService = fontService;

    this.updateFittedWidth();
    this.updateFittedHeight();
  }

  protected getWrapper(): ControlWrapper {
    return this.wrapper;
  }

  protected getLabelTemplate(): LayoutableControlLabelTemplate {
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

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  protected getFontService(): IFontService {
    return this.fontService;
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

  public getLayoutableProperties(): LayoutablePropertiesDefault {
    if (!this.layoutableProperties) {
      this.layoutableProperties = this.createLayoutableProperties();
    }
    return this.layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutablePropertiesDefault {
    return new LayoutablePropertiesDefault(this);
  }

  protected getComponentRef(): ComponentRef<ControlLabelComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelComponent>): void {
    this.componentRef = componentRef;
  }

  public getName(): string {
    return this.name;
  }

  public getIsEditable(): boolean {
    return this.getWrapper().getIsEditable();
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
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

  public getVisibility(): ControlVisibility {
    return this.getLabelTemplate().getIsVisible() ? ControlVisibility.Visible : ControlVisibility.Collapsed;
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
    return Number.zeroIfNull(this.isMinWidthSet() ? this.getLabelTemplate().getMinWidth() : this.fittedWidth);
  }

  public isMinWidthSet(): boolean {
    return this.getLabelTemplate().getMinWidth() != null;
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.isMinHeightSet() ? this.getLabelTemplate().getMinHeight() : this.fittedHeight);
  }

  public isMinHeightSet(): boolean {
    return this.getLabelTemplate().getMinHeight() != null;
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

  public updateFittedWidth(): void {
    this.setFittedContentWidth(this.getFontService().measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
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

  public attachComponent(container: ILayoutableContainerWrapper): void {
    const oldCompRef: ComponentRef<ControlLabelComponent> = this.getComponentRef();

    if (oldCompRef != null) {
      oldCompRef.destroy();
    }

    const compRef: ComponentRef<ControlLabelComponent> = this.createComponent(container);
    const compInstance: ControlLabelComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    compRef.onDestroy(this.detachComponent.bind(this));

    container.getViewContainerRef().insert(compRef.hostView);

    this.attachToVch(container);
  }

  protected detachComponent(): void {
    this.detachFromVch();
    this.componentRef = null;
  }

  public attachToVch(container: ILayoutableContainerWrapper): void {
    container.getVchContainer().addChild(this);
  }

  protected detachFromVch(): void {
    const vchParent: ILayoutableContainerWrapper = this.getVchControl().getParent();
    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }
  }
}
