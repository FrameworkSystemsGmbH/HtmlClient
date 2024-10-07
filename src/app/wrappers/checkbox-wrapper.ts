import { ComponentFactory, ComponentRef } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { CheckBoxComponent } from '@app/controls/checkbox/checkbox.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { Visibility } from '@app/enums/visibility';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { Subscription } from 'rxjs';

export class CheckBoxWrapper extends FittedWrapper {

  private _value: boolean = false;
  private _orgValue: boolean = false;
  private _dataSourceType: DataSourceType = DataSourceType.Bool;

  private _boxClickSub: Subscription | null = null;

  public getControlType(): ControlType {
    return ControlType.CheckBox;
  }

  public getValue(): boolean {
    return this._value;
  }

  public setValue(value: boolean): void {
    this._value = value;
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
    return this._value !== this._orgValue;
  }

  protected getValueJson(): string {
    let val: string;

    switch (this._dataSourceType) {
      case DataSourceType.Bool:
        val = this._value ? 'true' : 'false';
        break;

      case DataSourceType.Decimal:
      case DataSourceType.Double:
      case DataSourceType.Float:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
      case DataSourceType.String:
        val = this._value ? '1' : '0';
        break;

      default:
        throw new Error('Incompatible datasource type \'dataSourceType\' for checkbox control!');
    }

    return val;
  }

  protected setValueJson(value: string | null): void {
    let val: boolean;

    switch (this._dataSourceType) {
      case DataSourceType.Bool:
        val = value === 'true';
        break;

      case DataSourceType.Decimal:
      case DataSourceType.Double:
      case DataSourceType.Float:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
      case DataSourceType.String:
        val = value != null && value.trim().length > 0 && value !== '0';
        break;

      default:
        throw new Error(`Incompatible datasource type '${this._dataSourceType}' for checkbox control!`);
    }

    this._orgValue = val;
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
      this._dataSourceType = dataJson.text.type;
      this.setValueJson(dataJson.text.value);
    }
  }

  protected getComponentRef(): ComponentRef<CheckBoxComponent> | null {
    return super.getComponentRef() as ComponentRef<CheckBoxComponent> | null;
  }

  protected getComponent(): CheckBoxComponent | null {
    const compRef: ComponentRef<CheckBoxComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<CheckBoxComponent> {
    const factory: ComponentFactory<CheckBoxComponent> = this.getResolver().resolveComponentFactory(CheckBoxComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: CheckBoxComponent): void {
    super.attachEvents(instance);

    if (this.hasOnClickEvent()) {
      this._boxClickSub = instance.boxClick.subscribe({
        next: () => this.getBoxClickSubscription()()
      });
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    this._boxClickSub?.unsubscribe();
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) === ClientEventType.OnClick.valueOf();
  }

  protected getBoxClickSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {

        this.getEventsService().fireClick(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteBoxClick.bind(this),
            this.boxClickExecuted.bind(this),
            this.boxClickCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteBoxClick(payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected boxClickExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected boxClickCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.getFontService().measureTextWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getCheckBoxWidth() + this.getLabelGap());
    } else {
      this.setFittedContentWidth(this.getCheckBoxWidth());
    }
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(Math.max(this.getFontService().measureTextHeight(this.getFontFamily(), this.getFontSize()), this.getCheckBoxHeight()));
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.type = this._dataSourceType;
    json.value = this.getValueJson();
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this._dataSourceType = json.type;
    this.setValueJson(json.value);
  }
}
