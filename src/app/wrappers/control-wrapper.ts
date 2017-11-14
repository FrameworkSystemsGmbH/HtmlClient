import { ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';

import { ControlComponent } from '../controls/control.component';
import { ContainerWrapper } from './container-wrapper';
import { FormWrapper } from './form-wrapper';
import { ControlVisibility } from '../enums/control-visibility';
import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';
import { InternalEventCallbacks } from '../common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from '../common/events/client-enter-event';
import { ClientLeaveEvent } from '../common/events/client-leave-event';
import { ControlEvent } from '../enums/control-event';
import { ControlLayout } from '../layout/control-layout/control-layout';
import { VchControl } from '../vch/vch-control';
import { PropertyStore } from '../common/property-store';
import { PropertyData } from '../common/property-data';
import { PropertyLayer } from '../common/property-layer';
import { ILayoutableControl } from '../layout/layoutable-control';
import { LayoutBase } from '../layout/layout-base';
import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { ILayoutableControlLabel } from '../layout/layoutable-control-label';
import { ILayoutableControlLabelTemplate } from '../layout/layoutable-control-label-template';
import { ILayoutableContainer } from '../layout/layoutable-container';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';
import { LayoutableWrapper } from 'app/wrappers/layoutable-wrapper';

export abstract class ControlWrapper extends LayoutableWrapper {

  protected events: ControlEvent;
  protected vchControl: VchControl;
  protected componentFactoryResolver: ComponentFactoryResolver;
  protected eventsService: IEventsService;
  protected focusService: IFocusService;

  private componentRef: ComponentRef<ControlComponent>;
  private form: FormWrapper;
  private parent: ContainerWrapper;

  private onEnterSub: ISubscription;
  private onLeaveSub: ISubscription;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService
  ) {
    super();
    this.vchControl = new VchControl();
    this.form = form;
    this.parent = parent;
    this.componentFactoryResolver = resolver;
    this.eventsService = eventsService;
    this.focusService = focusService;
    this.setControlStyle(controlStyle);
    this.addToParent();
  }

  public getEvents(): ControlEvent {
    return this.events;
  }

  public addToParent(): void {
    if (this.parent) {
      this.parent.addChild(this);
    }
  }

  public getTabStop(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getTabStop());
  }

  public getIsEditable(): boolean {
    return Boolean.trueIfNull(this.propertyStore.getIsEditable());
  }

  public getForeColor(): string {
    const foreColor: string = this.propertyStore.getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string = this.propertyStore.getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
  }

  public isMinWidthSet(): boolean {
    return this.propertyStore.getMinWidth() != null;
  }

  public isMinHeightSet(): boolean {
    return this.propertyStore.getMinHeight() != null;
  }

  public isMaxWidthSet(): boolean {
    return this.propertyStore.getMaxWidth() != null;
  }

  public isMaxHeightSet(): boolean {
    return this.propertyStore.getMaxHeight() != null;
  }

  public getBorderColor(): string {
    const borderColor: string = this.propertyStore.getBorderColor();
    return borderColor != null ? borderColor : '#808080';
  }

  public getBorderRadiusTopLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusTopLeft());
  }

  public getBorderRadiusTopRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusTopRight());
  }

  public getBorderRadiusBottomLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusBottomLeft());
  }

  public getBorderRadiusBottomRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusBottomRight());
  }

  public getFontFamily(): string {
    const fontFamily: string = this.propertyStore.getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number = this.propertyStore.getFontSize();
    return fontSize != null ? fontSize : 14;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontBold());
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontItalic());
  }

  public getFontUnderline(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontUnderline());
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

  protected hasChangesLeave(): boolean {
    return false;
  }

  protected getComponentRef(): ComponentRef<ControlComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlComponent>): void {
    this.componentRef = componentRef;
  }

  protected getComponent(): ControlComponent {
    const compRef: ComponentRef<ControlComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public onComponentRefDestroyed(): void {
    this.detachComponent();
  }

  public getJson(): any {
    // Override in derived classes
  }

  public getMetaJson(): any {
    return { controlName: this.getName() };
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
      if (json.data) {
        this.setDataJson(json.data);
      }
    }

    const comp: ControlComponent = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  protected setMetaJson(metaJson: any): void {
    this.setName(metaJson.name);
  }

  protected setPropertiesJson(propertiesJson: any): void {
    this.propertyStore.setLayer(PropertyLayer.Control, propertiesJson as PropertyData);
  }

  protected setEventsJson(eventsJson: any) {
    if (!eventsJson || !eventsJson.length) {
      return;
    }

    for (const eventJson of eventsJson) {
      const event: ControlEvent = ControlEvent[eventJson as string];
      if (event != null) {
        this.events |= event;
      }
    }
  }

  protected setDataJson(dataJson: any) {
    // Override in subclasses
  }

  protected setControlStyle(controlStyle: PropertyData) {
    if (controlStyle) {
      this.propertyStore.setLayer(PropertyLayer.ControlStyle, controlStyle);
    }
  }

  public setFocus(): void {
    this.getComponent().setFocus();
  }

  protected abstract createComponent(container: ContainerWrapper): void;

  public attachComponent(container: ContainerWrapper): void {
    this.createComponent(container);
  }

  protected detachComponent(): void {
    this.detachEvents();
    this.detachFromVch();
    this.componentRef = null;
  }

  public attachToVch(container: ContainerWrapper): void {
    container.getVchContainer().addChild(this);
  }

  protected detachFromVch(): void {
    const vchParent: ContainerWrapper = this.getVchControl().getParent();
    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }
  }

  protected attachEvents(instance: ControlComponent): void {
    if (this.hasOnEnterEvent()) {
      this.onEnterSub = instance.onEnter.subscribe(event => this.getOnEnterSubscription(event)());
    }

    if (this.hasOnLeaveEvent()) {
      this.onLeaveSub = instance.onLeave.subscribe(event => this.getOnLeaveSubscription(event)());
    }
  }

  protected detachEvents(): void {
    if (this.onEnterSub) {
      this.onEnterSub.unsubscribe();
    }

    if (this.onLeaveSub) {
      this.onLeaveSub.unsubscribe();
    }
  }

  public hasOnEnterEvent(): boolean {
    return (this.events & ControlEvent.OnEnter) ? true : false;
  }

  protected getOnEnterSubscription(event: any): () => void {
    return () => this.eventsService.fireEnter(
      this.getForm().getId(),
      this.getName(),
      event,
      new InternalEventCallbacks<ClientEnterEvent>(
        this.canExecuteEnter.bind(this),
        this.onEnterExecuted.bind(this),
        this.onEnterCompleted.bind(this)
      )
    );
  }

  protected canExecuteEnter(originalEvent: any, clientEvent: ClientEnterEvent): boolean {
    return this.hasOnEnterEvent() && this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onEnterExecuted(originalEvent: any, clientEvent: ClientEnterEvent): void {
    // // Override in subclasses
  }

  protected onEnterCompleted(originalEvent: any, clientEvent: ClientEnterEvent): void {
    // // Override in subclasses
  }

  public hasOnLeaveEvent(): boolean {
    return (this.events & ControlEvent.OnLeave) ? true : false;
  }

  protected getOnLeaveSubscription(event: any): () => void {
    return () => this.eventsService.fireLeave(
      this.getForm().getId(),
      this.getName(),
      this.focusService.getLeaveActivator(),
      this.hasChangesLeave(),
      event,
      new InternalEventCallbacks<ClientLeaveEvent>(
        this.canExecuteLeave.bind(this),
        this.onLeaveExecuted.bind(this),
        this.onLeaveCompleted.bind(this)
      )
    );
  }

  protected canExecuteLeave(originalEvent: any, clientEvent: ClientLeaveEvent): boolean {
    return this.hasOnLeaveEvent() && this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onLeaveExecuted(originalEvent: any, clientEvent: ClientLeaveEvent): void {
    // // Override in subclasses
  }

  protected onLeaveCompleted(originalEvent: any, clientEvent: ClientLeaveEvent): void {
    // // Override in subclasses
  }
}
