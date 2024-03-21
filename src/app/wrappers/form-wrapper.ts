import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ControlComponent } from '@app/controls/control.component';
import { FormComponent } from '@app/controls/form/form.component';
import { ControlType } from '@app/enums/control-type';
import * as JsonUtil from '@app/util/json-util';
import { ButtonBaseWrapper } from '@app/wrappers/button-base-wrapper';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';
import { VariantWrapper } from '@app/wrappers/variant-wrapper';

export class FormWrapper extends ContainerWrapper {

  private _id: string = String.empty();
  private _fullName: string = String.empty();
  private _closing: boolean = false;
  private _isModal: boolean = false;
  private _variant: VariantWrapper | null = null;
  private _closeButton: ButtonBaseWrapper | null = null;
  private _focusWrapper: ControlWrapper | null = null;
  private _firstLayoutDone: boolean = false;

  public get closing(): boolean {
    return this._closing;
  }

  public set closing(closing: boolean) {
    this._closing = closing;
  }

  public getControlType(): ControlType {
    return ControlType.Form;
  }

  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this._fullName;
  }

  public getTitle(): string {
    const title: string | null = this.getDefaultVariant().getTitle();
    return title ?? this.getName();
  }

  public setTitleAction(title: string): void {
    this.getDefaultVariant().setTitle(title);
  }

  public getBackColor(): string {
    return this.getDefaultVariant().getBackColor();
  }

  public getIsModal(): boolean {
    return this._isModal;
  }

  public getCloseButton(): ButtonBaseWrapper | null {
    return this._closeButton;
  }

  public hideModalHeader(): boolean {
    return this.getDefaultVariant().getHideModalHeader();
  }

  public isCloseIconVisible(): boolean {
    return this.getDefaultVariant().getIsCloseIconVisible();
  }

  public isCloseEventAttached(): boolean {
    return this.getDefaultVariant().isCloseEventAttached();
  }

  public setCloseButtonAction(button: ButtonBaseWrapper): void {
    this._closeButton = button;
  }

  public getBadgeImageSrc(): SafeUrl | null {
    const badgeImageSrc: string | null = this.getDefaultVariant().getBadgeImageSrc();
    return badgeImageSrc != null && badgeImageSrc.trim().length > 0 ? this.getSanitizer().bypassSecurityTrustUrl(badgeImageSrc) : null;
  }

  public onComponentDestroyed(): void {
    super.onComponentDestroyed();
  }

  private getDefaultVariant(): VariantWrapper {
    if (!this._variant) {
      this._variant = this.controls.filter(wrapper => wrapper instanceof VariantWrapper)[0] as VariantWrapper;
    }
    return this._variant;
  }

  public getFirstLayoutDone(): boolean {
    return this._firstLayoutDone;
  }

  public requestFocus(focusWrapper: ControlWrapper): void {
    this._focusWrapper = focusWrapper;
  }

  public applyFocus(): void {
    if (this._focusWrapper != null) {
      const focusElement: any = this._focusWrapper.getFocusElement();

      if (focusElement != null && focusElement.focus != null) {
        focusElement.focus();
      }
    }

    this._focusWrapper = null;
  }

  protected getComponentRef(): ComponentRef<FormComponent> | null {
    return super.getComponentRef() as ComponentRef<FormComponent> | null;
  }

  protected getComponent(): FormComponent | null {
    const compRef: ComponentRef<FormComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: FormComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get FormComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public getMetaJson(): any {
    return { id: this.getId() };
  }

  protected setMetaJson(metaJson: any): void {
    this._id = metaJson.id;
    this._fullName = metaJson.fullName;
    this._isModal = metaJson.modal;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent> {
    throw new Error('A form creates its component directly on the frame\'s ViewContainerRef in \'attachComponentToFrame()\'');
  }

  public attachComponentToFrame(vc: ViewContainerRef): void {
    // Die Factory baut die Angular FormComponent auf und hängt sie anschließend in den Anchor, also das DOM
    // Hierfür wird der injector benötigt.
    const compFactory: ComponentFactory<FormComponent> = this.getResolver().resolveComponentFactory(FormComponent);
    //vc ist der #anchor Factory kann das in einen DOM reinhängen mit dem injector des anchors
    const compRef: ComponentRef<FormComponent> = compFactory.create(vc.injector);
    const compInstance: FormComponent = compRef.instance;

    this.setComponentRef(compRef);
    // An der FormComponent-Instance wird dann die NGComponent mit dem Wrapper verknüpft.
    compInstance.setWrapper(this);

    this.attachEvents(compInstance);

    for (const child of this.controls) {
      child.attachComponent(this, this);
    }

    vc.insert(compRef.hostView);
  }

  /** 1:1 Java Copy */
  public doLayout(availableWidth: number, availableHeight: number): void {
    // Get the absolute minimum width of the form -rekursiv über alle forms
    const minWidth: number = this.getMinLayoutWidth();

    // Get the minimum height depending on the available width but don't deceed the minimum width
    const minHeight: number = this.getMinLayoutHeight(Math.max(minWidth, availableWidth));

    let resultWidth: number;
    let resultHeight: number;

    let hBarNeeded: boolean = false;

    if (minWidth < availableWidth) {
      hBarNeeded = false;
      resultWidth = availableWidth;
    } else {
      hBarNeeded = true;
      resultWidth = minWidth;
    }

    if (minHeight < availableHeight) {
      resultHeight = availableHeight;
    } else {
      resultHeight = minHeight;
    }
    // an den LayoutableProperties die Properties setzen
    const layoutableProperties: LayoutableProperties = this.getLayoutableProperties();
    layoutableProperties.setLayoutWidth(resultWidth);
    layoutableProperties.setLayoutHeight(resultHeight);
    layoutableProperties.setHBarNeeded(hBarNeeded);

    this.getLayout().arrange();

    this._firstLayoutDone = true;
  }

  public saveState(): any {
    const json: any = super.saveState();

    json.id = this._id;
    json.fullName = this._fullName;
    json.closing = this._closing;
    json.isModal = this._isModal;

    if (this._closeButton != null) {
      json.closeButton = this._closeButton.getName();
    }

    if (this._focusWrapper != null) {
      json.focusWrapper = this._focusWrapper.getName();
    }

    const controlsJson: Array<any> = new Array<any>();
    this.getControlsState(controlsJson);

    if (!JsonUtil.isEmptyObject(controlsJson)) {
      json.controls = controlsJson;
    }

    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    this._id = json.id;
    this._fullName = json.fullName;
    this._closing = json.closing;
    this._isModal = json.isModal;
  }

  public loadStateAfterControlsSet(json: any): void {
    if (json.closeButton && json.closeButton.trim().length > 0) {
      this._closeButton = this.findControlRecursive(json.closeButton) as ButtonBaseWrapper;
    }

    if (json.focusWrapper && json.focusWrapper.trim().length > 0) {
      this._focusWrapper = this.findControlRecursive(json.focusWrapper);
    }
  }
}
