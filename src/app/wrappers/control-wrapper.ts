import { ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IControlsService } from 'app/services/controls.service';
import { IEventsService } from 'app/services/events.service';
import { IFocusService } from 'app/services/focus.service';

import { ControlComponent } from 'app/controls/control.component';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';
import { ControlLayout } from 'app/layout/control-layout/control-layout';
import { VchControl } from 'app/vch/vch-control';
import { PropertyStore } from 'app/common/property-store';
import { PropertyData } from 'app/common/property-data';
import { PropertyLayer } from 'app/common/property-layer';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientLeaveEvent } from 'app/common/events/client-leave-event';
import { ControlEvent } from 'app/enums/control-event';

export abstract class ControlWrapper implements ILayoutableControlWrapper {

  private name: string;
  private form: FormWrapper;
  private parent: ContainerWrapper;
  private propertyStore: PropertyStore;
  private vchControl: VchControl;
  private layout: LayoutBase;
  private layoutableProperties: LayoutablePropertiesDefault;
  private labelTemplate: LayoutableControlLabelTemplate;
  private resolver: ComponentFactoryResolver;
  private componentRef: ComponentRef<ControlComponent>;
  private events: ControlEvent;

  private controlsService: IControlsService;
  private eventsService: IEventsService;
  private focusService: IFocusService;

  private onEnterSub: ISubscription;
  private onLeaveSub: ISubscription;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    controlsService: IControlsService,
    eventsService: IEventsService,
    focusService: IFocusService
  ) {
    this.form = form;
    this.parent = parent;
    this.resolver = resolver;
    this.controlsService = controlsService;
    this.eventsService = eventsService;
    this.focusService = focusService;
    this.setControlStyle(controlStyle);
    this.addToParent();
  }

  public getName(): string {
    return this.name;
  }

  protected setName(name: string): void {
    this.name = name;
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

  protected getPropertyStore(): PropertyStore {
    if (!this.propertyStore) {
      this.propertyStore = this.createPropertyStore();
    }
    return this.propertyStore;
  }

  protected createPropertyStore(): PropertyStore {
    return new PropertyStore();
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

  protected getEvents(): ControlEvent {
    return this.events;
  }

  protected getControlsService(): IControlsService {
    return this.controlsService;
  }

  protected getEventsService(): IEventsService {
    return this.eventsService;
  }

  protected getFocusService(): IFocusService {
    return this.focusService;
  }

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  protected addToParent(): void {
    if (this.parent) {
      this.parent.addChild(this);
    }
  }

  public getCaption(): string {
    const caption: string = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public getVisibility(): ControlVisibility {
    const visibility: ControlVisibility = this.getPropertyStore().getVisibility();
    return visibility != null ? visibility : ControlVisibility.Visible;
  }

  public getTabStop(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getTabStop());
  }

  public getIsEditable(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getIsEditable());
  }

  public getForeColor(): string {
    const foreColor: string = this.getPropertyStore().getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string = this.getPropertyStore().getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
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
    return Number.zeroIfNull(this.getPropertyStore().getMinWidth());
  }

  public isMinWidthSet(): boolean {
    return this.getPropertyStore().getMinWidth() != null;
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMinHeight());
  }

  public isMinHeightSet(): boolean {
    return this.getPropertyStore().getMinHeight() != null;
  }

  public getMaxWidth(): number {
    return Number.maxIfNull(this.getPropertyStore().getMaxWidth());
  }

  public isMaxWidthSet(): boolean {
    return this.getPropertyStore().getMaxWidth() != null;
  }

  public getMaxHeight(): number {
    return Number.maxIfNull(this.getPropertyStore().getMaxHeight());
  }

  public isMaxHeightSet(): boolean {
    return this.getPropertyStore().getMaxHeight() != null;
  }

  public getMarginLeft(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMarginLeft());
  }

  public getMarginRight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMarginRight());
  }

  public getMarginTop(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMarginTop());
  }

  public getMarginBottom(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMarginBottom());
  }

  public getBorderColor(): string {
    const borderColor: string = this.getPropertyStore().getBorderColor();
    return borderColor != null ? borderColor : '#808080';
  }

  public getBorderRadiusTopLeft(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderRadiusTopLeft());
  }

  public getBorderRadiusTopRight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderRadiusTopRight());
  }

  public getBorderRadiusBottomLeft(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderRadiusBottomLeft());
  }

  public getBorderRadiusBottomRight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderRadiusBottomRight());
  }

  public getBorderThicknessLeft(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessLeft());
  }

  public getBorderThicknessRight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessRight());
  }

  public getBorderThicknessTop(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessTop());
  }

  public getBorderThicknessBottom(): number {
    return Number.zeroIfNull(this.getPropertyStore().getBorderThicknessBottom());
  }

  public getPaddingLeft(): number {
    return Number.zeroIfNull(this.getPropertyStore().getPaddingLeft());
  }

  public getPaddingRight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getPaddingRight());
  }

  public getPaddingTop(): number {
    return Number.zeroIfNull(this.getPropertyStore().getPaddingTop());
  }

  public getPaddingBottom(): number {
    return Number.zeroIfNull(this.getPropertyStore().getPaddingBottom());
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
    const dockItemSize: number = this.getPropertyStore().getDockItemSize();
    return dockItemSize != null ? dockItemSize : null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    const hAlign: HorizontalAlignment = this.getPropertyStore().getHorizontalAlignment();
    return hAlign != null ? hAlign : HorizontalAlignment.Stretch;
  }

  public getVerticalAlignment(): VerticalAlignment {
    const vAlign: VerticalAlignment = this.getPropertyStore().getVerticalAlignment();
    return vAlign != null ? vAlign : VerticalAlignment.Stretch;
  }

  public getFontFamily(): string {
    const fontFamily: string = this.getPropertyStore().getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number = this.getPropertyStore().getFontSize();
    return fontSize != null ? fontSize : 14;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getFontBold());
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getFontItalic());
  }

  public getFontUnderline(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getFontUnderline());
  }

  public getLabelTemplate(): LayoutableControlLabelTemplate {
    if (!this.labelTemplate) {
      this.labelTemplate = this.createLabelTemplate();
    }
    return this.labelTemplate;
  }

  protected createLabelTemplate(): LayoutableControlLabelTemplate {
    return new LayoutableControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.labelTemplate));
  }

  public getForm(): FormWrapper {
    return this.form;
  }

  public getParent(): ContainerWrapper {
    return this.parent;
  }

  protected hasChangesLeave(): boolean {
    return false;
  }

  public getJson(): any {
    return null; // Override in derived classes
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
    this.getPropertyStore().setLayer(PropertyLayer.Control, propertiesJson as PropertyData);
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
      this.getPropertyStore().setLayer(PropertyLayer.ControlStyle, controlStyle);
    }
  }

  public setFocus(): void {
    this.getComponent().setFocus();
  }

  protected abstract createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent>;

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    const oldCompRef: ComponentRef<ControlComponent> = this.getComponentRef();

    if (oldCompRef != null) {
      oldCompRef.destroy();
    }

    // Create the Angular Component
    const compRef: ComponentRef<ControlComponent> = this.createComponent(uiContainer);
    const compInstance: ControlComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Attach events to the Component
    this.attachEvents(compInstance);

    // Register onDestroy handler of the Angular component
    compRef.onDestroy(this.detachComponent.bind(this));

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);
  }

  protected detachComponent(): void {
    // Detach RxJS event subscriptions
    this.detachEvents();

    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this.componentRef = null;
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
