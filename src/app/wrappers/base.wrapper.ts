import { ComponentRef } from '@angular/core';

import { BaseComponent } from '../controls';
import { ContainerWrapper, FormWrapper } from '../wrappers';
import { EventsService } from '../services';
import { VchControl } from '../models/vch/index';
import { LayoutableControl, LayoutableProperties } from '../layouts/index';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums/index';

export abstract class BaseWrapper implements LayoutableControl {

  protected eventsService: EventsService;

  private componentRef: ComponentRef<BaseComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;
  private vchControl: VchControl;

  private id: string;
  private name: string;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlJson: any,
    eventsService: EventsService
  ) {
    this.vchControl = new VchControl();
    this.form = form;
    this.parent = parent;
    this.eventsService = eventsService;
    this.initialize(controlJson);
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getVisibility(): ControlVisibility {
    return ControlVisibility.Visible;
  }

  public getLayoutableProperties(): LayoutableProperties {
    return null;
  }

  public getOuterWidth(): number {
    return 0;
  }

  public setOuterWidth(width: number): void {

  }

  public getOuterHeight(): number {
    return 0;
  }

  public setOuterHeight(height: number): void {

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

  public getVchControl(): VchControl {
    return this.vchControl;
  }

  protected getComponentRef(): ComponentRef<BaseComponent> {
    return this.componentRef;
  }

  protected getComponent(): BaseComponent {
    return this.componentRef.instance;
  }

  protected initialize(controlJson: any): void {
    this.setJson(controlJson, false);
  }

  public getJson(): any {
    return null;
  }

  public setJson(controlJson: any, delta: boolean): void {
    this.setMetaJson(controlJson.meta);
    this.setPropertiesJson(controlJson.properties);
    this.setDataJson(controlJson.data);
    this.setEventsJson(controlJson.events);
  }

  protected setMetaJson(metaJson: any): void {
    this.setId(metaJson.id);
    this.setName(metaJson.name);
  }

  protected setPropertiesJson(propertiesJson: any): void {
    // BaseWrapper does not have shared properties
  }

  protected setDataJson(dataJson: any): void {
    // BaseWrapper does not have shared data
  }

  protected setEventsJson(eventsJson: any): void {
    // BaseWrapper does not have shared events
  }

  public addComponentToView(): void {

  }

  public updateComponent(): void {

  }

  public setFocus(): void {
    this.getComponent().setFocus();
  }

}
