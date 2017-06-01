import { ComponentRef } from '@angular/core';

import { ContainerWrapper, FormWrapper } from '.';
import { BaseComponent } from '../controls';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';
import { LayoutControl, LayoutProperties, LayoutControlLabel, LayoutControlLabelTemplate, LayoutContainer } from '../layout';
import { EventsService } from '../services';
import { VchControl } from '../vch';

export abstract class BaseWrapper implements LayoutControl {

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
