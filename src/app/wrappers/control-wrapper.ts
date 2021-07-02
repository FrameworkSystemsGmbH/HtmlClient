import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { ControlComponent } from '@app/controls/control.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { ControlLayout } from '@app/layout/control-layout/control-layout';
import { LayoutBase } from '@app/layout/layout-base';
import { ControlStyleService } from '@app/services/control-style.service';
import { IWrapperCreationOptions } from '@app/services/controls.service';
import { EventsService } from '@app/services/events.service';
import { FocusService } from '@app/services/focus.service';
import { FontService } from '@app/services/font.service';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { PatternFormatService } from '@app/services/formatter/pattern-format.service';
import { StringFormatService } from '@app/services/formatter/string-format.service';
import { FramesService } from '@app/services/frames.service';
import { ImageService } from '@app/services/image.service';
import { PlatformService } from '@app/services/platform.service';
import * as EnumUtil from '@app/util/enum-util';
import * as JsonUtil from '@app/util/json-util';
import { VchControl } from '@app/vch/vch-control';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { IControlLabelProvider } from '@app/wrappers/control-labels/control-label-provider.interface';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';
import { IControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper.interface';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';
import { Subscription } from 'rxjs';

export abstract class ControlWrapper implements ILayoutableControlWrapper, IControlLabelProvider {

  private readonly _injector: Injector;
  private readonly _resolver: ComponentFactoryResolver;
  private readonly _sanitizer: DomSanitizer;
  private readonly _controlStyleService: ControlStyleService;
  private readonly _eventsService: EventsService;
  private readonly _focusService: FocusService;
  private readonly _fontService: FontService;
  private readonly _framesService: FramesService;
  private readonly _imageService: ImageService;
  private readonly _platformService: PlatformService;
  private readonly _dateTimeFormatService: DateTimeFormatService;
  private readonly _numberFormatService: NumberFormatService;
  private readonly _patternFormatService: PatternFormatService;
  private readonly _stringFormatService: StringFormatService;

  private readonly _form: FormWrapper | null = null;
  private readonly _parent: ContainerWrapper | null = null;
  private readonly _controlStyle: string | null = null;

  private _name: string = String.empty();
  private _propertyStore: PropertyStore | null = null;
  private _vchControl: VchControl | null = null;
  private _layout: LayoutBase | null = null;
  private _layoutableProperties: LayoutableProperties | null = null;
  private _labelTemplate: ControlLabelTemplate | null = null;
  private _componentRef: ComponentRef<ControlComponent> | null = null;
  private _events: ClientEventType = ClientEventType.None;
  private _isEditableParent: boolean;
  private _visibilityParent: Visibility = Visibility.Visible;
  private _controlLabel: IControlLabelWrapper | null = null;

  private _ctrlEnterSub: Subscription | null = null;
  private _ctrlLeaveSub: Subscription | null = null;

  public constructor(
    injector: Injector,
    options?: IWrapperCreationOptions
  ) {
    this._injector = injector;
    this._isEditableParent = true;

    this._resolver = this._injector.get(ComponentFactoryResolver);
    this._sanitizer = this._injector.get(DomSanitizer);
    this._controlStyleService = this._injector.get(ControlStyleService);
    this._eventsService = this._injector.get(EventsService);
    this._focusService = this._injector.get(FocusService);
    this._fontService = this._injector.get(FontService);
    this._framesService = this._injector.get(FramesService);
    this._imageService = this._injector.get(ImageService);
    this._platformService = this._injector.get(PlatformService);
    this._dateTimeFormatService = this._injector.get(DateTimeFormatService);
    this._numberFormatService = this._injector.get(NumberFormatService);
    this._patternFormatService = this._injector.get(PatternFormatService);
    this._stringFormatService = this._injector.get(StringFormatService);

    this.init();

    if (options) {
      this._form = options.form ? options.form : null;
      this._parent = options.parent ? options.parent : null;
      this._controlStyle = options.controlStyle ? options.controlStyle : null;

      if (options.state) {
        this.loadState(options.state);
      }
    }

    this.setControlStyle();
    this.addToParent();
    this.updateRecursiveProperties();
  }

  protected init(): void {
    // Override in subclasses
  }

  protected updateRecursiveProperties(): void {
    this.updateVisibilityParent();
    this.updateIsEditableParent();
  }

  protected getInjector(): Injector {
    return this._injector;
  }

  protected getResolver(): ComponentFactoryResolver {
    return this._resolver;
  }

  protected getSanitizer(): DomSanitizer {
    return this._sanitizer;
  }

  protected getControlStyleService(): ControlStyleService {
    return this._controlStyleService;
  }

  protected getEventsService(): EventsService {
    return this._eventsService;
  }

  protected getFocusService(): FocusService {
    return this._focusService;
  }

  protected getFontService(): FontService {
    return this._fontService;
  }

  protected getFramesService(): FramesService {
    return this._framesService;
  }

  protected getImageService(): ImageService {
    return this._imageService;
  }

  protected getPlatformService(): PlatformService {
    return this._platformService;
  }

  protected getDateTimeFormatService(): DateTimeFormatService {
    return this._dateTimeFormatService;
  }

  protected getNumberFormatService(): NumberFormatService {
    return this._numberFormatService;
  }

  protected getPatternFormatService(): PatternFormatService {
    return this._patternFormatService;
  }

  protected getStringFormatService(): StringFormatService {
    return this._stringFormatService;
  }

  public getName(): string {
    return this._name;
  }

  protected setName(name: string): void {
    this._name = name;
  }

  public getVchControl(): VchControl {
    if (!this._vchControl) {
      this._vchControl = this.createVchControl();
    }
    return this._vchControl;
  }

  protected createVchControl(): VchControl {
    return new VchControl();
  }

  protected getPropertyStore(): PropertyStore {
    if (!this._propertyStore) {
      this._propertyStore = this.createPropertyStore();
    }
    return this._propertyStore;
  }

  protected createPropertyStore(): PropertyStore {
    return new PropertyStore();
  }

  protected getLayout(): LayoutBase {
    if (!this._layout) {
      this._layout = this.createLayout();
    }
    return this._layout;
  }

  protected createLayout(): LayoutBase {
    return new ControlLayout(this);
  }

  public getLayoutableProperties(): LayoutableProperties {
    if (!this._layoutableProperties) {
      this._layoutableProperties = new LayoutableProperties(this);
    }
    return this._layoutableProperties;
  }

  protected getComponentRef(): ComponentRef<ControlComponent> | null {
    return this._componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlComponent>): void {
    this._componentRef = componentRef;
  }

  protected getComponent(): ControlComponent | null {
    const compRef: ComponentRef<ControlComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public updateComponent(): void {
    const comp: ControlComponent | null = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public updateComponentRecursively(): void {
    this.updateComponent();
    this.updateControlLabelComponentRecursively();
  }

  protected getEvents(): ClientEventType {
    return this._events;
  }

  protected addToParent(): void {
    if (this._parent) {
      this._parent.addChild(this);
    }
  }

  public getCaption(): string | null {
    const caption: string | undefined = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public setCaptionAction(caption: string): void {
    this.getPropertyStore().setCaption(PropertyLayer.Action, caption);
    this.onWrapperCaptionChanged();
  }

  protected onWrapperCaptionChanged(): void {
    if (this._controlLabel) {
      this._controlLabel.onWrapperCaptionChanged();
    }
  }

  public getVisibility(): Visibility {
    const visibility: Visibility | undefined = this.getPropertyStore().getVisibility();
    return visibility != null ? visibility : Visibility.Visible;
  }

  public getCurrentVisibility(): Visibility {
    if (this._visibilityParent !== Visibility.Visible) {
      return this._visibilityParent;
    } else {
      return this.getVisibility();
    }
  }

  public setVisibilityAction(visibility: Visibility): void {
    this.getPropertyStore().setVisibility(PropertyLayer.Action, visibility);
    this.onWrapperVisibilityChanged();
  }

  public updateVisibilityParent(): void {

    /*
     * Check the actual parent not the VCH parent
     * Otherwise one could work around business logic
     */
    if (this._parent != null) {
      this._visibilityParent = this._parent.getCurrentVisibility();
    } else {
      this._visibilityParent = Visibility.Visible;
    }

    this.onWrapperVisibilityChanged();
  }

  protected onWrapperVisibilityChanged(): void {
    if (this._controlLabel) {
      this._controlLabel.onWrapperVisibilityChanged();
    }
  }

  public getTabStop(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getTabStop());
  }

  public getIsEditable(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getIsEditable());
  }

  public getCurrentIsEditable(): boolean {
    return this._isEditableParent && this.getIsEditable();
  }

  public setIsEditableAction(value: boolean): void {
    this.getPropertyStore().setIsEditable(PropertyLayer.Action, value);
  }

  public updateIsEditableParent(): void {

    /*
     * Check the actual parent not the VCH parent
     * Otherwise one could work around business logic
     */
    if (this._parent != null) {
      this._isEditableParent = this._parent.getCurrentIsEditable();
    } else {
      this._isEditableParent = true;
    }
  }

  public getForeColor(): string {
    const foreColor: string | undefined = this.getPropertyStore().getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string | undefined = this.getPropertyStore().getBackColor();
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
    const borderColor: string | undefined = this.getPropertyStore().getBorderColor();
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

  public getDockItemSize(): number | null {
    const dockItemSize: number | undefined = this.getPropertyStore().getDockItemSize();
    return dockItemSize != null ? dockItemSize : null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    const hAlign: HorizontalAlignment | undefined = this.getPropertyStore().getHorizontalAlignment();
    return hAlign != null ? hAlign : HorizontalAlignment.Stretch;
  }

  public getVerticalAlignment(): VerticalAlignment {
    const vAlign: VerticalAlignment | undefined = this.getPropertyStore().getVerticalAlignment();
    return vAlign != null ? vAlign : VerticalAlignment.Stretch;
  }

  public getFontFamily(): string {
    const fontFamily: string | undefined = this.getPropertyStore().getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number | undefined = this.getPropertyStore().getFontSize();
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
    return this._fontService.measureTextHeight(this.getFontFamily(), this.getFontSize());
  }

  public providesControlLabelWrapper(): boolean {
    return !String.isNullOrEmpty(this.getCaption());
  }

  public getControlLabelWrapper(fieldRowWrp: FieldRowWrapper): IControlLabelWrapper | null {
    if (!this._controlLabel) {
      this._controlLabel = this.createControlLabelWrapper(fieldRowWrp);
    }
    return this._controlLabel;
  }

  protected createControlLabelWrapper(fieldRowWrp: FieldRowWrapper): IControlLabelWrapper | null {
    return new ControlLabelWrapper(this._injector, this, fieldRowWrp);
  }

  protected updateControlLabelComponentRecursively(): void {
    if (this._controlLabel) {
      this._controlLabel.updateComponentRecursively();
    }
  }

  public getLabelTemplate(): ControlLabelTemplate {
    if (!this._labelTemplate) {
      this._labelTemplate = this.createLabelTemplate();
    }
    return this._labelTemplate;
  }

  protected createLabelTemplate(): ControlLabelTemplate {
    return new ControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.labelTemplate));
  }

  public getForm(): FormWrapper | null {
    return this._form;
  }

  public getParent(): ContainerWrapper | null {
    return this._parent;
  }

  protected hasChangesLeave(): boolean {
    return false;
  }

  public getJson(): any {
    return null; // Override in subclasses
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
    this.getPropertyStore().setLayer(PropertyLayer.Control, propertiesJson);
  }

  protected setEventsJson(eventsJson: any): void {
    if (!eventsJson || !eventsJson.length) {
      return;
    }

    for (const eventJson of eventsJson) {
      const event: ClientEventType | null = EnumUtil.getNumberEnumFromString(ClientEventType, eventJson);
      if (event != null) {
        this._events |= event;
      }
    }
  }

  protected setDataJson(dataJson: any): void {
    // Override in subclasses
  }

  protected setControlStyle(): void {
    if (this._controlStyle) {
      const controlStyleData: PropertyData | null = this._controlStyleService.getControlStyle(this._controlStyle);
      if (controlStyleData != null) {
        this.getPropertyStore().setLayer(PropertyLayer.ControlStyle, controlStyleData);
      }
    }
  }

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

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ControlComponent> | null = this.getComponentRef();

    if (compRef != null) {
      compRef.destroy();
    }
  }

  public onComponentDestroyed(): void {
    // Unsubscribe RxJS event subscriptions
    this.detachEvents();

    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper | null = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this._componentRef = null;
  }

  protected attachEvents(instance: ControlComponent): void {
    if (this.hasOnEnterEvent()) {
      this._ctrlEnterSub = instance.ctrlEnter.subscribe(() => this.getCtrlEnterSubscription()());
    }

    if (this.hasOnLeaveEvent()) {
      this._ctrlLeaveSub = instance.ctrlLeave.subscribe(() => this.getCtrlLeaveSubscription()());
    }
  }

  protected detachEvents(): void {
    if (this._ctrlEnterSub) {
      this._ctrlEnterSub.unsubscribe();
    }

    if (this._ctrlLeaveSub) {
      this._ctrlLeaveSub.unsubscribe();
    }
  }

  public hasOnEnterEvent(): boolean {
    return (this._events & ClientEventType.OnEnter) === ClientEventType.OnEnter;
  }

  protected getCtrlEnterSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this._eventsService.fireEnter(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteCtrlEnter.bind(this),
            this.ctrlEnterExecuted.bind(this),
            this.ctrlEnterCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteCtrlEnter(payload: any): boolean {
    return this.hasOnEnterEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected ctrlEnterExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected ctrlEnterCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public hasOnLeaveEvent(): boolean {
    return (this._events & ClientEventType.OnLeave) === ClientEventType.OnLeave;
  }

  protected getCtrlLeaveSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this._eventsService.fireLeave(
          form.getId(),
          this.getName(),
          this._focusService.getLeaveActivator(),
          this.hasChangesLeave(),
          new InternalEventCallbacks(
            this.canExecuteCtrlLeave.bind(this),
            this.ctrlLeaveExecuted.bind(this),
            this.ctrlLeaveCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteCtrlLeave(payload: any): boolean {
    return this.hasOnLeaveEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected ctrlLeaveExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected ctrlLeaveCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public saveState(): any {
    const json: any = {
      controlType: this.getControlType(),
      name: this._name,
      isParentEditable: this._isEditableParent
    };

    // Only persist parent affiliation of nested controls
    if (this._parent && this._parent !== this._form) {
      json.parent = this._parent.getName();
    }

    if (!String.isNullOrWhiteSpace(this._controlStyle)) {
      json.controlStyle = this._controlStyle;
    }

    const propertyStore: any = this.getPropertyStore().saveState();

    if (!JsonUtil.isEmptyObject(propertyStore)) {
      json.propertyStore = propertyStore;
    }

    json.events = this._events;

    return json;
  }

  protected loadState(json: any): void {
    this._name = json.name;
    this._isEditableParent = json.isParentEditable;

    if (json.propertyStore) {
      this.getPropertyStore().loadState(json.propertyStore);
    }

    if (json.events) {
      this._events = json.events;
    }
  }

  public canReceiveFocus(): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  public canReceiveKeyboardFocus(): boolean {
    return this.canReceiveFocus() && this.getTabStop();
  }

  public focusKeyboardPrevious(): void {
    const previousControl: ILayoutableControlWrapper | null = this._focusService.findPreviousKeyboardFocusableControl(this);

    if (previousControl) {
      previousControl.setFocus();
    }
  }

  public focusKeyboardNext(): void {
    const nextControl: ILayoutableControlWrapper | null = this._focusService.findNextKeyboardFocusableControl(this);

    if (nextControl) {
      nextControl.setFocus();
    }
  }

  public setFocus(): void {
    if (this.canReceiveFocus()) {
      const form: FormWrapper | null = this.getForm();

      if (form) {
        form.requestFocus(this);
      }
    }
  }

  public getFocusElement(): HTMLElement | null {
    const comp = this.getComponent();

    if (comp) {
      return comp.getFocusElement();
    }

    return null;
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused && !this._platformService.isNative();
  }

  public abstract getControlType(): ControlType;

  protected abstract createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent>;
}
