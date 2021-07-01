import { ComponentFactory, ComponentRef } from '@angular/core';
import { DataList } from '@app/common/data-list';
import { DataListEntry } from '@app/common/data-list-entry';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { ComboBoxFreeMobileComponent } from '@app/controls/comboboxes/combobox-free-mobile/combobox-free-mobile.component';
import { ComboBoxFreeComponent } from '@app/controls/comboboxes/combobox-free/combobox-free.component';
import { ComboBoxListMobileComponent } from '@app/controls/comboboxes/combobox-list-mobile/combobox-list-mobile.component';
import { ComboBoxListComponent } from '@app/controls/comboboxes/combobox-list/combobox-list.component';
import { ComboBoxComponent } from '@app/controls/comboboxes/combobox.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { EditStyle } from '@app/enums/edit-style';
import { Visibility } from '@app/enums/visibility';
import { FittedDataWrapper } from '@app/wrappers/fitted-data-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { Subscription } from 'rxjs';

export class ComboBoxWrapper extends FittedDataWrapper {

  private _value: string | null = null;
  private _orgValue: string | null = null;

  private _dataList: DataList | null = null;

  private _selectionChangedSub: Subscription | null = null;

  public getControlType(): ControlType {
    return ControlType.ComboBox;
  }

  public getValue(): string | null {
    return this._value;
  }

  public setValue(value: string | null): void {
    this._value = value;
  }

  protected getValueJson(): string {
    return this._value == null ? String.empty() : this._value;
  }

  protected setValueJson(value: string): void {
    const val: string = value != null ? value : String.empty();
    this._orgValue = val;
    this.setValue(val);
  }

  public getEntries(): DataList | null {
    return this._dataList;
  }

  public getCaption(): string | null {
    const caption: string | undefined = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public getEditStyle(): EditStyle {
    const editStyle: EditStyle | undefined = this.getPropertyStore().getEditStyle();
    return editStyle != null ? editStyle : EditStyle.ListValuesInput;
  }

  public getListType(): DataSourceType {
    const listType: DataSourceType | undefined = this.getPropertyStore().getListType();
    return listType != null ? listType : DataSourceType.None;
  }

  public getListDisplayMinLength(): number {
    return Number.zeroIfNull(this.getPropertyStore().getListDisplayMinLength());
  }

  public getListDisplayMaxLength(): number {
    return Number.maxIfNull(this.getPropertyStore().getListDisplayMaxLength());
  }

  public getMaxDropDownWidth(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMaxDropDownWidth());
  }

  public getMaxDropDownHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMaxDropDownHeight());
  }

  protected getArrowWidth(): number {
    const comp: ComboBoxComponent | null = this.getComponent();
    return comp ? comp.getArrowWidth() : 0;
  }

  protected getDataMinWidth(): number {
    return this.getFontService().getDataMinWidthComboBox(this) + this.getArrowWidth();
  }

  protected getDataMaxWidth(): number {
    return this.getFontService().getDataMaxWidthComboBox(this) + this.getArrowWidth();
  }

  protected getDataMinHeight(): number {
    return 0;
  }

  protected getDataMaxHeight(): number {
    return 0;
  }

  protected getComponentRef(): ComponentRef<ComboBoxComponent> | null {
    return super.getComponentRef() as ComponentRef<ComboBoxComponent> | null;
  }

  protected getComponent(): ComboBoxComponent | null {
    const compRef: ComponentRef<ComboBoxComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ComboBoxComponent> {
    const compType: any = this.getEditStyle() === EditStyle.ListValuesInput
      ? this.getPlatformService().isNative() ? ComboBoxListMobileComponent : ComboBoxListComponent
      : this.getPlatformService().isNative() ? ComboBoxFreeMobileComponent : ComboBoxFreeComponent;
    const factory: ComponentFactory<ComboBoxComponent> = this.getResolver().resolveComponentFactory(compType);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected hasChangesLeave(): boolean {
    return this.hasChanges();
  }

  protected hasChanges(): boolean {
    return this._value !== this._orgValue;
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

    this.setListJson(dataJson.list);
  }

  protected setListJson(listJson: any): void {
    if (!listJson) {
      return;
    }

    const listCount: number = listJson.count;

    if (listCount === 0) {
      this._dataList = null;
    } else if (listCount > 0) {
      const newDataList: DataList = new DataList();
      for (const row of listJson.rows) {
        const pk: string = row.pk != null ? row.pk : String.empty();
        const value: string = row.value != null ? row.value : String.empty();
        newDataList.push(new DataListEntry(pk, value));
      }
      this._dataList = newDataList;
    }
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(null);
  }

  protected attachEvents(instance: ComboBoxComponent): void {
    super.attachEvents(instance);

    if (this.hasOnSelectionChangedEvent()) {
      this._selectionChangedSub = instance.selectionChanged.subscribe(() => this.getOnSelectionChangedSubscription()());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this._selectionChangedSub) {
      this._selectionChangedSub.unsubscribe();
    }
  }

  protected ctrlEnterCompleted(payload: any, processedEvent: any): void {
    const comp: ComboBoxComponent | null = this.getComponent();
    if (comp != null) {
      comp.onAfterEnter();
    }
  }

  public hasOnSelectionChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectionChanged) === ClientEventType.OnSelectionChanged;
  }

  protected getOnSelectionChangedSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireSelectionChanged(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteSelectionChanged.bind(this),
            this.onSelectionChangedExecuted.bind(this),
            this.onSelectionChangedCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteSelectionChanged(payload: any): boolean {
    return this.hasOnSelectionChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectionChangedExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectionChangedCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.value = this.getValueJson();

    if (this._dataList) {
      json.entries = this._dataList;
    }

    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    this.setValueJson(json.value);

    if (json.entries && json.entries.length) {
      const entries: DataList = new DataList();
      entries.deserialize(json.entries);
      this._dataList = entries;
    }
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused;
  }
}
