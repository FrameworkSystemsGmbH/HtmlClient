import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';

import { ContainerWrapper, FormWrapper } from '.';
import { BaseComponent } from '../controls';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';
import { LayoutControl, LayoutProperties, LayoutControlLabel, LayoutControlLabelTemplate, LayoutContainer } from '../layout';
import { VchControl, VchContainer } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';

export abstract class BaseWrapper implements LayoutControl {

  protected appInjector: Injector;
  protected vchControl: VchControl;
  protected propertyStore: PropertyStore;
  protected eventsService: EventsService;
  protected controlStyleService: ControlStyleService;

  private componentRef: ComponentRef<BaseComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;

  private id: string;
  private name: string;

  constructor(
    json: any,
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
    this.initialize(json);
  }

  public abstract updateComponent(): void;

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getVisibility(): ControlVisibility {
    return this.propertyStore.getVisibility();
  }

  public getBackgroundColor(): string {
    return this.propertyStore.getBackgroundColor();
  }

  public getLayoutableProperties(): LayoutProperties {
    return null;
  }

  public getControlLabel(): LayoutControlLabel {
    return null;
  }

  public getLabelTemplate(): LayoutControlLabelTemplate {
    return null;
  }

  public getMinWidth(): number {
    return 0;
  }

  public getMinHeight(): number {
    return 0;
  }

  public getMaxWidth(): number {
    return 0;
  }

  public getMaxHeight(): number {
    return 0;
  }

  public getInsetsLeft(): number {
    return 0;
  }

  public getInsetsRight(): number {
    return 0;
  }

  public getInsetsTop(): number {
    return 0;
  }

  public getInsetsBottom(): number {
    return 0;
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

  public getDockItemSize(): number {
    return 0;
  }

  public getFieldRowSize(): number {
    return 0;
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    return HorizontalAlignment.Stretch;
  }

  public getAlignmentVertical(): VerticalAlignment {
    return VerticalAlignment.Stretch;
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

  protected initialize(json: any): void {
    this.setJson(json, false);
  }

  // public getDto(): ResponseControlDto {
  //   return null;
  // }

  public setJson(json: any, delta: boolean): void {
    if (delta) {

    } else {
      this.setMetaJson(json);
      this.setPropertiesJson(json.properties);
    }
  }

  protected setMetaJson(json: any): void {
    this.id = json.id;
    this.name = json.name;
    this.setControlStyle(json.controlStyle);
  }

  protected setControlStyle(controlStyle: string) {
    if (controlStyle) {
      let style: PropertyData = this.controlStyleService.getControlStyle(controlStyle);
      if (style) {
        this.propertyStore.setLayer(PropertyLayer.ControlStyle, style);
      }
    }
  }

  protected setPropertiesJson(propertiesJson: any): void {
    this.propertyStore.setLayer(PropertyLayer.Control, propertiesJson as PropertyData);
  }

  protected setDataJson(dataJson: any) {
    // BaseWrapper does not have data
  }

  protected setEventsJson(dataJson: any) {
    // BaseWrapper does not have events
  }

  public setFocus(): void {
    this.getComponent().setFocus();
  }

  public attachComponent(container: ContainerWrapper): void {
    container.getVchContainer().addChild(this);
  }

}
