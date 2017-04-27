import { ComponentRef } from '@angular/core';

import { BaseComponent } from '../controls';
import { ContainerWrapper, FormWrapper } from '../wrappers';
import { EventsService } from '../services';

export abstract class BaseWrapper {

  protected eventsService: EventsService;

  private componentRef: ComponentRef<BaseComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;

  private name: string;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlJson: any,
    eventsService: EventsService
  ) {
    this.form = form;
    this.parent = parent;
    this.eventsService = eventsService;
    this.initialize(controlJson);
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getForm(): FormWrapper {
    return this.form;
  }

  public getParent(): ContainerWrapper {
    return this.parent;
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
