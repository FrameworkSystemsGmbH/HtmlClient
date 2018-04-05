import { ComponentRef, ComponentFactory } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { CheckBoxComponent } from 'app/controls/checkbox/checkbox.component';
import { FittedWrapper } from 'app/wrappers/fitted-wrapper';
import { ControlType } from 'app/enums/control-type';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ControlEvent } from 'app/enums/control-event';
import { ControlVisibility } from 'app/enums/control-visibility';

export class CheckBoxWrapper extends FittedWrapper {

  private onClickSub: ISubscription;

  private value: boolean;
  private orgValue: boolean;

  public getControlType(): ControlType {
    return ControlType.CheckBox;
  }

  public getValue(): boolean {
    return this.value;
  }

  public setValue(value: boolean): void {
    this.value = value;
  }

  // Width of the Material CheckBox
  public getCheckBoxWidth(): number {
    return 20;
  }

  // Height of the Material CheckBox
  public getCheckBoxHeight(): number {
    return 20;
  }

  // Width of the gap between the Material CheckBox an the label
  public getLabelGap(): number {
    return 3;
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getShowCaption());
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getValueJson(): string {
    return this.value == null ? 'false' : encodeURIComponent(this.value === true ? 'true' : 'false');
  }

  protected setValueJson(value: string): void {
    const val: boolean = value != null ? decodeURIComponent(value) === 'true' : false;
    this.orgValue = val;
    this.setValue(val);
  }

  public getJson(): any {
    if (!this.hasChanges()) {
      return null;
    }

    const controlJson: any = {
      meta: {
        name: this.getName()
      },
      data: {
        text: this.getValueJson()
      }
    };

    return controlJson;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.text && dataJson.text.value !== undefined) {
      this.setValueJson(dataJson.text.value);
    }
  }

  protected getComponentRef(): ComponentRef<CheckBoxComponent> {
    return super.getComponentRef() as ComponentRef<CheckBoxComponent>;
  }

  protected getComponent(): CheckBoxComponent {
    const compRef: ComponentRef<CheckBoxComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<CheckBoxComponent> {
    const factory: ComponentFactory<CheckBoxComponent> = this.getResolver().resolveComponentFactory(CheckBoxComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: CheckBoxComponent): void {
    super.attachEvents(instance);

    if (this.getEvents() & ControlEvent.OnClick) {
      this.onClickSub = instance.onClick.subscribe(event => this.getOnClickSubscription(event)());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnClick) ? true : false;
  }

  protected getOnClickSubscription(event: any): () => void {
    return () => this.getEventsService().fireClick(
      this.getForm().getId(),
      this.getName(),
      event,
      new InternalEventCallbacks<ClientClickEvent>(
        this.canExecuteClick.bind(this),
        this.onClickExecuted.bind(this),
        this.onClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteClick(originalEvent: any, clientEvent: ClientClickEvent): boolean {
    return this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onClickExecuted(originalEvent: any, clientEvent: ClientClickEvent): void {
    // Override in subclasses
  }

  protected onClickCompleted(originalEvent: any, clientEvent: ClientClickEvent): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.getFontService().measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getCheckBoxWidth() + this.getLabelGap());
    } else {
      this.setFittedContentWidth(this.getCheckBoxWidth());
    }
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(Math.max(this.getFontSize(), this.getCheckBoxHeight()));
  }

  public getState(): any {
    const json: any = super.getState();
    json.value = this.getValueJson();
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.setValueJson(json.value);
  }
}
