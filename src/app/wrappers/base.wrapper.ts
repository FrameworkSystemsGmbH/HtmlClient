import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';

import { ContainerWrapper, FormWrapper } from '.';
import { BaseComponent } from '../controls';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';
import { LayoutControl, LayoutControlLabel, LayoutControlLabelTemplate, LayoutContainer, LayoutProperties } from '../layout';
import { VchControl, VchContainer } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';
import { DefaultLayoutProperties } from '../common';

export abstract class BaseWrapper implements LayoutControl {

  protected appInjector: Injector;
  protected vchControl: VchControl;
  protected propertyStore: PropertyStore;
  protected eventsService: EventsService;
  protected controlStyleService: ControlStyleService;

  private componentRef: ComponentRef<BaseComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;

  private name: string;
  private layoutProperties: DefaultLayoutProperties;

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

  public addToParent(): void {
    if (this.parent) {
      this.parent.addControl(this);
    }
  }

  public getName(): string {
    return this.name;
  }

  public getVisibility(): ControlVisibility {
    return this.propertyStore.getVisibility();
  }

  public getBackgroundColor(): string {
    return this.propertyStore.getBackColor();
  }

  public getLayoutProperties(): LayoutProperties {
    if (!this.layoutProperties) {
      this.layoutProperties = new DefaultLayoutProperties(this);
    }

    return this.layoutProperties;
  }

  public getControlLabel(): LayoutControlLabel {
    return null;
  }

  public getLabelTemplate(): LayoutControlLabelTemplate {
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
    return this.getPaddingLeft() + this.getBorderThicknessLeft();
  }

  public getInsetsRight(): number {
    return this.getPaddingRight() + this.getBorderThicknessRight();
  }

  public getInsetsTop(): number {
    return this.getPaddingTop() + this.getBorderThicknessTop();
  }

  public getInsetsBottom(): number {
    return this.getPaddingBottom() + this.getBorderThicknessBottom();
  }

  public getDockItemSize(): number {
    return this.propertyStore.getDockItemSize();
  }

  public getFieldRowSize(): number {
    return this.propertyStore.getFieldRowSize();
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    return this.propertyStore.getHorizontalAlignment();
  }

  public getAlignmentVertical(): VerticalAlignment {
    return this.propertyStore.getVerticalAlignment();
  }

  public getForm(): FormWrapper {
    return this.form;
  }

  public getParent(): ContainerWrapper {
    return this.parent;
  }

  public setParent(container: LayoutContainer) {
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
