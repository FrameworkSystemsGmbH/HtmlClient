import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ContainerWrapper, FormWrapper } from '.';
import { BaseComponent } from '../controls';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment, ControlEvent } from '../enums';
import { LayoutableControl, LayoutableControlLabel, LayoutableControlLabelTemplate, LayoutableContainer, LayoutableProperties, LayoutBase, LayoutablePropertiesDefault } from '../layout';
import { VchControl, VchContainer } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';
import { ControlLayout } from '../layout/control-layout';

export abstract class BaseWrapper implements LayoutableControl {

  protected events: ControlEvent;
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

  private onEnterSub: ISubscription;
  private onLeaveSub: ISubscription;
  private onDragSub: ISubscription;
  private onCanDropSub: ISubscription;

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

  public getEvents(): ControlEvent {
    return this.events;
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

  public getTabStop(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getTabStop());
  }

  public getVisibility(): ControlVisibility {
    let visibility: ControlVisibility = this.propertyStore.getVisibility();
    return visibility != null ? visibility : ControlVisibility.Collapsed;
  }

  public getForeColor(): string {
    let foreColor: string = this.propertyStore.getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    let backColor: string = this.propertyStore.getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
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
    return Number.zeroIfNull(this.propertyStore.getMinWidth());
  }

  public isMinWidthSet(): boolean {
    return this.propertyStore.getMinWidth() != null;
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.propertyStore.getMinHeight());
  }

  public isMinHeightSet(): boolean {
    return this.propertyStore.getMinHeight() != null;
  }

  public getMaxWidth(): number {
    return Number.maxIfNull(this.propertyStore.getMaxWidth());
  }

  public isMaxWidthSet(): boolean {
    return this.propertyStore.getMaxWidth() != null;
  }

  public getMaxHeight(): number {
    return Number.maxIfNull(this.propertyStore.getMaxHeight());
  }

  public isMaxHeightSet(): boolean {
    return this.propertyStore.getMaxHeight() != null;
  }

  public getMarginLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginLeft());
  }

  public getMarginRight(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginRight());
  }

  public getMarginTop(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginTop());
  }

  public getMarginBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginBottom());
  }

  public getPaddingLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingLeft());
  }

  public getPaddingRight(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingRight());
  }

  public getPaddingTop(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingTop());
  }

  public getPaddingBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingBottom());
  }

  public getBorderColor(): string {
    let borderColor: string = this.propertyStore.getBorderColor();
    return borderColor != null ? borderColor : '#808080';
  }

  public getBorderThicknessLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessLeft());
  }

  public getBorderThicknessRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessRight());
  }

  public getBorderThicknessTop(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessTop());
  }

  public getBorderThicknessBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessBottom());
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
    let dockItemSize: number = this.propertyStore.getDockItemSize();
    return dockItemSize != null ? dockItemSize : null;
  }

  public getFieldRowSize(): number {
    let fieldRowSize: number = this.propertyStore.getFieldRowSize();
    return fieldRowSize != null ? fieldRowSize : null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    let hAlign: HorizontalAlignment = this.propertyStore.getHorizontalAlignment();
    return hAlign != null ? hAlign : HorizontalAlignment.Stretch;
  }

  public getVerticalAlignment(): VerticalAlignment {
    let vAlign: VerticalAlignment = this.propertyStore.getVerticalAlignment();
    return vAlign != null ? vAlign : VerticalAlignment.Stretch;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontBold());
  }

  public getFontFamily(): string {
    let fontFamily: string = this.propertyStore.getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontItalic());
  }

  public getFontSize(): number {
    let fontSize: number = this.propertyStore.getFontSize();
    return fontSize != null ? fontSize : 14;
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
    let compRef: ComponentRef<BaseComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public onComponentRefDestroyed(): void {
    this.detachEvents();
    this.componentRef = null;
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

    let comp: BaseComponent = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  protected setMetaJson(metaJson: any): void {
    this.name = metaJson.name;
    this.setControlStyle(metaJson.style);
  }

  protected setPropertiesJson(propertiesJson: any): void {
    this.propertyStore.setLayer(PropertyLayer.Control, propertiesJson as PropertyData);
  }

  protected setEventsJson(eventsJson: any) {
    if (!eventsJson || !eventsJson.length) {
      return;
    }

    for (let eventJson of eventsJson) {
      let event: ControlEvent = ControlEvent[<string>eventJson];
      if (event != null) {
        this.events |= event;
      }
    }
  }

  protected setDataJson(dataJson: any) {
    // Override in subclasses
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

  protected attachEvents(instance: BaseComponent): void {
    if (this.events & ControlEvent.OnEnter) {
      this.onEnterSub = instance.onEnter.subscribe(event => this.eventsService.fireEnter(this.getForm().getId(), this.getName()));
    }

    if (this.events & ControlEvent.OnLeave) {
      this.onLeaveSub = instance.onLeave.subscribe(event => this.eventsService.fireLeave(this.getForm().getId(), this.getName(), false));
    }

    if (this.events & ControlEvent.OnDrag) {
      this.onDragSub = instance.onDrag.subscribe(event => { });
    }

    if (this.events & ControlEvent.OnCanDrop) {
      this.onCanDropSub = instance.onCanDrop.subscribe(event => { });
    }
  }

  protected detachEvents(): void {
    if (this.onEnterSub) {
      this.onEnterSub.unsubscribe();
    }

    if (this.onLeaveSub) {
      this.onLeaveSub.unsubscribe();
    }

    if (this.onDragSub) {
      this.onDragSub.unsubscribe();
    }

    if (this.onCanDropSub) {
      this.onCanDropSub.unsubscribe();
    }
  }

}