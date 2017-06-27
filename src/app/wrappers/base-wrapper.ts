import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';

import { ContainerWrapper, FormWrapper } from '.';
import { BaseComponent } from '../controls';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';
import { LayoutableControl, LayoutableControlLabel, LayoutableControlLabelTemplate, LayoutableContainer, LayoutableProperties, LayoutBase, LayoutablePropertiesDefault } from '../layout';
import { VchControl, VchContainer } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';
import { ControlLayout } from '../layout/control-layout';

export abstract class BaseWrapper implements LayoutableControl {

  protected appInjector: Injector;
  protected vchControl: VchControl;
  protected propertyStore: PropertyStore;
  protected eventsService: EventsService;
  protected controlStyleService: ControlStyleService;

  private componentRef: ComponentRef<BaseComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;

  private name: string;
  private layout: LayoutBase;
  private layoutableProperties: LayoutablePropertiesDefault;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector
  ) {
    this.vchControl = new VchControl();
    this.propertyStore = new PropertyStore();
    this.form = form;
    this.parent = parent;
    this.appInjector = appInjector;
    this.eventsService = appInjector.get(EventsService);
    this.controlStyleService = appInjector.get(ControlStyleService);
    this.addToParent();
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

  public getMinLayoutWidth(): number {
    return this.getLayout().measureMinWidth();
  }

  public getMinLayoutHeight(width: number): number {
    return this.getLayout().measureMinHeight(width);
  }

  public getMaxLayoutWidth(): number {
    return Number.maxIfNull(this.getMaxWidth());
  }

  public getMaxLayoutHeight(): number {
    return Number.maxIfNull(this.getMaxHeight());
  }

  public getName(): string {
    return this.name;
  }

  public addToParent(): void {
    if (this.parent) {
      this.parent.addControl(this);
    }
  }

  public getVisibility(): ControlVisibility {
    return this.propertyStore.getVisibility();
  }

  public getBackgroundColor(): string {
    return this.propertyStore.getBackColor();
  }

  public getLayoutableProperties(): LayoutableProperties {
    if (!this.layoutableProperties) {
      this.layoutableProperties = new LayoutablePropertiesDefault(this);
    }
    return this.layoutableProperties;
  }

  public getControlLabel(): LayoutableControlLabel {
    return null;
  }

  public getLabelTemplate(): LayoutableControlLabelTemplate {
    return null;
  }

  public getMinWidth(): number {
    return this.propertyStore.getMinWidth();
  }

  public getMinHeight(): number {
    return this.propertyStore.getMinHeight();
  }

  public getMaxWidth(): number {
    return this.propertyStore.getMaxWidth();
  }

  public getMaxHeight(): number {
    return this.propertyStore.getMaxHeight();
  }

  public getMarginLeft(): number {
    return this.propertyStore.getMarginLeft();
  }

  public getMarginRight(): number {
    return this.propertyStore.getMarginRight();
  }

  public getMarginTop(): number {
    return this.propertyStore.getMarginTop();
  }

  public getMarginBottom(): number {
    return this.propertyStore.getMarginBottom();
  }

  public getPaddingLeft(): number {
    return this.propertyStore.getPaddingLeft();
  }

  public getPaddingRight(): number {
    return this.propertyStore.getPaddingRight();
  }

  public getPaddingTop(): number {
    return this.propertyStore.getPaddingTop();
  }

  public getPaddingBottom(): number {
    return this.propertyStore.getPaddingBottom();
  }

  public getBorderColor(): string {
    return this.propertyStore.getBorderColor();
  }

  public getBorderThicknessLeft(): number {
    return this.propertyStore.getBorderThicknessLeft();
  }

  public getBorderThicknessRight(): number {
    return this.propertyStore.getBorderThicknessRight();
  }

  public getBorderThicknessTop(): number {
    return this.propertyStore.getBorderThicknessTop();
  }

  public getBorderThicknessBottom(): number {
    return this.propertyStore.getBorderThicknessBottom();
  }

  public getInsetsLeft(): number {
    return this.getPaddingLeft() + this.getBorderThicknessLeft() + this.getMarginLeft();
  }

  public getInsetsRight(): number {
    return this.getPaddingRight() + this.getBorderThicknessRight() + this.getMarginRight();
  }

  public getInsetsTop(): number {
    return this.getPaddingTop() + this.getBorderThicknessTop() + this.getMarginTop();
  }

  public getInsetsBottom(): number {
    return this.getPaddingBottom() + this.getBorderThicknessBottom() + this.getMarginBottom();
  }

  public getDockItemSize(): number {
    return this.propertyStore.getDockItemSize();
  }

  public getFieldRowSize(): number {
    return this.propertyStore.getFieldRowSize();
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return this.propertyStore.getHorizontalAlignment();
  }

  public getVerticalAlignment(): VerticalAlignment {
    return this.propertyStore.getVerticalAlignment();
  }

  public getFontBold(): boolean {
    return this.propertyStore.getFontBold();
  }

  public getFontFamily(): string {
    return this.propertyStore.getFontFamily();
  }

  public getFontItalic(): boolean {
    return this.propertyStore.getFontItalic();
  }

  public getFontSize(): number {
    return this.propertyStore.getFontSize();
  }

  public getFontUnderline(): boolean {
    return this.propertyStore.getFontUnderline();
  }

  public getForm(): FormWrapper {
    return this.form;
  }

  public getParent(): ContainerWrapper {
    return this.parent;
  }

  public setParent(container: LayoutableContainer) {
    this.parent = container as ContainerWrapper;
  }

  public getVchControl(): VchControl {
    return this.vchControl;
  }

  protected getComponentRef(): ComponentRef<BaseComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<BaseComponent>): void {
    this.componentRef = componentRef;
  }

  protected getComponent(): BaseComponent {
    return this.getComponentRef().instance;
  }

  public onComponentRefDestroyed(): void {
    this.componentRef = null;
  }

  public setJson(json: any, isNew: boolean): void {
    if (isNew) {
      if (json.meta) {
        this.setMetaJson(json.meta);
      }
      if (json.properties) {
        this.setPropertiesJson(json.properties);
      }
      if (json.events) {
        this.setEventsJson(json.events);
      }
      if (json.data) {
        this.setDataJson(json.data);
      }
    } else {

    }
  }

  protected setMetaJson(metaJson: any): void {
    this.name = metaJson.name;
    this.setControlStyle(metaJson.style);
  }

  protected setPropertiesJson(propertiesJson: any): void {
    this.propertyStore.setLayer(PropertyLayer.Control, propertiesJson as PropertyData);
  }

  protected setEventsJson(dataJson: any) {
    // BaseWrapper does not have events
  }

  protected setDataJson(dataJson: any) {
    // BaseWrapper does not have data
  }

  protected setControlStyle(controlStyle: string) {
    if (controlStyle) {
      let style: PropertyData = this.controlStyleService.getControlStyle(controlStyle);
      if (style) {
        this.propertyStore.setLayer(PropertyLayer.ControlStyle, style);
      }
    }
  }

  public setFocus(): void {
    this.getComponent().setFocus();
  }

  public attachComponent(container: ContainerWrapper): void {
    this.createComponent(container);
    container.getVchContainer().addChild(this);
  }

  public abstract createComponent(container: ContainerWrapper): void;

  public abstract updateComponent(): void;

}
