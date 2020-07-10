import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper.interface';
import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';
import { IWrapperCreationOptions } from 'app/services/controls.service';

import { ControlStyleService } from 'app/services/control-style.service';
import { EventsService } from 'app/services/events.service';
import { FocusService } from 'app/services/focus.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { ControlComponent } from 'app/controls/control.component';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { LayoutableProperties } from 'app/wrappers/layout/layoutable-properties-default';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { ControlLayout } from 'app/layout/control-layout/control-layout';
import { VchControl } from 'app/vch/vch-control';
import { PropertyStore } from 'app/common/property-store';
import { PropertyData } from 'app/common/property-data';
import { PropertyLayer } from 'app/common/property-layer';
import { Visibility } from 'app/enums/visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientLeaveEvent } from 'app/common/events/client-leave-event';
import { ClientEventType } from 'app/enums/client-event-type';
import { ControlType } from 'app/enums/control-type';
import { FontService } from 'app/services/font.service';

import * as JsonUtil from 'app/util/json-util';

export abstract class ControlWrapper implements ILayoutableControlWrapper, IControlLabelProvider {

  private name: string;
  private form: FormWrapper;
  private parent: ContainerWrapper;
  private controlStyle: string;
  private propertyStore: PropertyStore;
  private vchControl: VchControl;
  private layout: LayoutBase;
  private layoutableProperties: LayoutableProperties;
  private labelTemplate: ControlLabelTemplate;
  private componentRef: ComponentRef<ControlComponent>;
  private events: ClientEventType;
  private isEditableParent: boolean;
  private visibilityParent: Visibility;

  private controlLabel: IControlLabelWrapper;

  private injector: Injector;
  private resolver: ComponentFactoryResolver;
  private controlStyleService: ControlStyleService;
  private eventsService: EventsService;
  private focusService: FocusService;
  private fontService: FontService;
  private platformService: PlatformService;

  private onEnterSub: Subscription;
  private onLeaveSub: Subscription;

  constructor(
    injector: Injector,
    options?: IWrapperCreationOptions
  ) {
    this.injector = injector;
    this.isEditableParent = true;

    this.init();

    if (options) {
      this.form = options.form;
      this.parent = options.parent;
      this.controlStyle = options.controlStyle;

      if (options.state) {
        this.setState(options.state);
      }
    }

    this.setControlStyle();
    this.addToParent();
    this.updateRecursiveProperties();
  }

  protected init(): void {
    // tslint:disable-next-line: deprecation
    this.resolver = this.injector.get(ComponentFactoryResolver);
    this.controlStyleService = this.injector.get(ControlStyleService);
    this.eventsService = this.injector.get(EventsService);
    this.focusService = this.injector.get(FocusService);
    this.fontService = this.injector.get(FontService);
    // tslint:disable-next-line: deprecation
    this.platformService = this.injector.get(PlatformService);
  }

  protected updateRecursiveProperties(): void {
    this.updateVisibilityParent();
    this.updateIsEditableParent();
  }

  public abstract getControlType(): ControlType;

  protected getInjector(): Injector {
    return this.injector;
  }

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  protected getControlStyleService(): ControlStyleService {
    return this.controlStyleService;
  }

  protected getEventsService(): EventsService {
    return this.eventsService;
  }

  protected getFocusService(): FocusService {
    return this.focusService;
  }

  protected getFontService(): FontService {
    return this.fontService;
  }

  protected getPlatformService(): PlatformService {
    return this.platformService;
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

  public getLayoutableProperties(): LayoutableProperties {
    if (!this.layoutableProperties) {
      this.layoutableProperties = new LayoutableProperties(this);
    }
    return this.layoutableProperties;
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

  public updateComponent(): void {
    const comp: ControlComponent = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public updateComponentRecursively(): void {
    this.updateComponent();
    this.updateControlLabelComponentRecursively();
  }

  protected getEvents(): ClientEventType {
    return this.events;
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

  public getVisibility(): Visibility {
    const visibility: Visibility = this.getPropertyStore().getVisibility();
    return visibility != null ? visibility : Visibility.Visible;
  }

  public getCurrentVisibility(): Visibility {
    if (this.visibilityParent !== Visibility.Visible) {
      return this.visibilityParent;
    } else {
      return this.getVisibility();
    }
  }

  public setVisibilityAction(visibility: Visibility): void {
    this.getPropertyStore().setVisibility(PropertyLayer.Action, visibility);
    this.onWrapperVisibilityChanged();
  }

  public updateVisibilityParent(): void {
    // Check the actual parent not the VCH parent
    // Otherwise one could work around business logic
    if (this.parent != null) {
      this.visibilityParent = this.parent.getCurrentVisibility();
    } else {
      this.visibilityParent = Visibility.Visible;
    }

    this.onWrapperVisibilityChanged();
  }

  protected onWrapperVisibilityChanged(): void {
    if (this.controlLabel) {
      this.controlLabel.onWrapperVisibilityChanged();
    }
  }

  public getTabStop(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getTabStop());
  }

  public getIsEditable(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getIsEditable());
  }

  public getCurrentIsEditable(): boolean {
    return this.isEditableParent && this.getIsEditable();
  }

  public setIsEditableAction(value: boolean): void {
    this.getPropertyStore().setIsEditable(PropertyLayer.Action, value);
  }

  public updateIsEditableParent(): void {
    // Check the actual parent not the VCH parent
    // Otherwise one could work around business logic
    if (this.parent != null) {
      this.isEditableParent = this.parent.getCurrentIsEditable();
    } else {
      this.isEditableParent = true;
    }
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

  public getMinHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMinHeight());
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

  public getLineHeight(): number {
    return this.fontService.measureTextHeight(this.getFontFamily(), this.getFontSize());
  }

  public providesControlLabelWrapper(): boolean {
    return !!this.getCaption();
  }

  public getControlLabelWrapper(): IControlLabelWrapper {
    if (!this.controlLabel) {
      this.controlLabel = this.createControlLabelWrapper();
    }
    return this.controlLabel;
  }

  protected createControlLabelWrapper(): IControlLabelWrapper {
    return new ControlLabelWrapper(this.injector, this);
  }

  protected updateControlLabelComponentRecursively(): void {
    if (this.controlLabel) {
      this.controlLabel.updateComponentRecursively();
    }
  }

  public getLabelTemplate(): ControlLabelTemplate {
    if (!this.labelTemplate) {
      this.labelTemplate = this.createLabelTemplate();
    }
    return this.labelTemplate;
  }

  protected createLabelTemplate(): ControlLabelTemplate {
    return new ControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.labelTemplate));
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
    } else if (json.data) {
      this.setDataJson(json.data);
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
      const event: ClientEventType = ClientEventType[eventJson as string];
      if (event != null) {
        this.events |= event;
      }
    }
  }

  protected setDataJson(dataJson: any) {
    // Override in subclasses
  }

  protected setControlStyle() {
    if (this.controlStyle) {
      const controlStyleData: PropertyData = this.controlStyleService.getControlStyle(this.controlStyle);
      this.getPropertyStore().setLayer(PropertyLayer.ControlStyle, controlStyleData);
    }
  }

  protected abstract createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent>;

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    this.detachComponent();

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
    compRef.onDestroy(this.onComponentDestroyed.bind(this));

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ControlComponent> = this.getComponentRef();

    if (compRef != null) {
      compRef.destroy();
    }
  }

  protected onComponentDestroyed(): void {
    // Unsubscribe RxJS event subscriptions
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
      this.onEnterSub = instance.onEnter.subscribe(() => this.getOnEnterSubscription()());
    }

    if (this.hasOnLeaveEvent()) {
      this.onLeaveSub = instance.onLeave.subscribe(() => this.getOnLeaveSubscription()());
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
    return (this.events & ClientEventType.OnEnter) ? true : false;
  }

  protected getOnEnterSubscription(): () => void {
    return () => this.eventsService.fireEnter(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientEnterEvent>(
        this.canExecuteEnter.bind(this),
        this.onEnterExecuted.bind(this),
        this.onEnterCompleted.bind(this)
      )
    );
  }

  protected canExecuteEnter(clientEvent: ClientEnterEvent, payload: any): boolean {
    return this.hasOnEnterEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onEnterExecuted(clientEvent: ClientEnterEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onEnterCompleted(clientEvent: ClientEnterEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public hasOnLeaveEvent(): boolean {
    return (this.events & ClientEventType.OnLeave) ? true : false;
  }

  protected getOnLeaveSubscription(): () => void {
    return () => this.eventsService.fireLeave(
      this.getForm().getId(),
      this.getName(),
      this.focusService.getLeaveActivator(),
      this.hasChangesLeave(),
      new InternalEventCallbacks<ClientLeaveEvent>(
        this.canExecuteLeave.bind(this),
        this.onLeaveExecuted.bind(this),
        this.onLeaveCompleted.bind(this)
      )
    );
  }

  protected canExecuteLeave(clientEvent: ClientLeaveEvent, payload: any): boolean {
    return this.hasOnLeaveEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onLeaveExecuted(clientEvent: ClientLeaveEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onLeaveCompleted(clientEvent: ClientLeaveEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public getState(): any {
    const json: any = {
      controlType: this.getControlType(),
      name: this.name,
      isParentEditable: this.isEditableParent
    };

    // Only persist parent affiliation of nested controls
    if (this.parent && this.parent !== this.form) {
      json.parent = this.parent.getName();
    }

    if (!String.isNullOrWhiteSpace(this.controlStyle)) {
      json.controlStyle = this.controlStyle;
    }

    const propertyStore: any = this.getPropertyStore().getState();

    if (!JsonUtil.isEmptyObject(propertyStore)) {
      json.propertyStore = propertyStore;
    }

    if (this.events != null) {
      json.events = this.events;
    }

    return json;
  }

  protected setState(json: any): void {
    this.name = json.name;
    this.isEditableParent = json.isParentEditable;

    if (json.propertyStore) {
      this.getPropertyStore().setState(json.propertyStore);
    }

    if (json.events) {
      this.events = json.events;
    }
  }

  public canReceiveFocus(): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  public canReceiveKeyboardFocus(): boolean {
    return this.canReceiveFocus() && this.getTabStop();
  }

  public focusKeyboardPrevious(): void {
    const previousControl: ILayoutableControlWrapper = this.focusService.findPreviousKeyboardFocusableControl(this);

    if (previousControl) {
      previousControl.setFocus();
    }
  }

  public focusKeyboardNext(): void {
    const nextControl: ILayoutableControlWrapper = this.focusService.findNextKeyboardFocusableControl(this);

    if (nextControl) {
      nextControl.setFocus();
    }
  }

  public setFocus(): void {
    if (this.canReceiveFocus()) {
      const comp: ControlComponent = this.getComponent();

      if (comp) {
        comp.setFocus();
      }
    }
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused && !this.getPlatformService().isMobile();
  }
}
