import { ComponentRef, ComponentFactory } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { CheckBoxComponent } from 'app/controls/checkbox/checkbox.component';
import { FittedWrapper } from 'app/wrappers/fitted-wrapper';
import { ControlType } from 'app/enums/control-type';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { DataSourceType } from 'app/enums/datasource-type';
import { ControlEvent } from 'app/enums/control-event';
import { Visibility } from 'app/enums/visibility';

export class CheckBoxWrapper extends FittedWrapper {

  private onClickSub: Subscription;

  private value: boolean;
  private orgValue: boolean;
  private dataSourceType: DataSourceType;

  protected init(): void {
    super.init();
    this.dataSourceType = DataSourceType.Bool;
  }

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

  public providesControlLabelWrapper(): boolean {
    return super.providesControlLabelWrapper() && !this.showCaption();
  }

  protected hasChanges(): boolean {
    return this.dataSourceType != null && this.value !== this.orgValue;
  }

  protected getValueJson(): string {
    let val: string;

    switch (this.dataSourceType) {
      case DataSourceType.Bool:
        val = this.value == null ? 'false' : encodeURIComponent(this.value === true ? 'true' : 'false');
        break;

      case DataSourceType.Decimal:
      case DataSourceType.Double:
      case DataSourceType.Float:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
      case DataSourceType.String:
        val = this.value == null ? '0' : encodeURIComponent(this.value === true ? '1' : '0');
        break;

      default:
        throw new Error('Incompatible datasource type \'dataSourceType\' for checkbox control!');
    }

    return val;
  }

  protected setValueJson(value: string): void {
    let val: boolean = false;

    switch (this.dataSourceType) {
      case DataSourceType.Bool:
        val = value != null ? decodeURIComponent(value) === 'true' : false;
        break;

      case DataSourceType.Decimal:
      case DataSourceType.Double:
      case DataSourceType.Float:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
      case DataSourceType.String:
        val = value != null ? decodeURIComponent(value) !== '0' : false;
        break;

      default:
        throw new Error('Incompatible datasource type \'' + this.dataSourceType + '\' for checkbox control!');
    }

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

    if (dataJson.text && dataJson.text.type !== undefined && dataJson.text.value !== undefined) {
      this.dataSourceType = dataJson.text.type;
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
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
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
    json.type = this.dataSourceType;
    json.value = this.getValueJson();
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.dataSourceType = json.type;
    this.setValueJson(json.value);
  }
}
