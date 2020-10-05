import { ComponentFactory, ComponentRef } from '@angular/core';
import { DataList } from '@app/common/data-list';
import { DataListEntry } from '@app/common/data-list-entry';
import { ClientEnterEvent } from '@app/common/events/client-enter-event';
import { ClientSelectionChangedEvent } from '@app/common/events/client-selection-changed-event';
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
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { Subscription } from 'rxjs';

export class ComboBoxWrapper extends FittedDataWrapper {

  private value: string;
  private orgValue: string;

  private dataList: DataList;

  private selectionChangedSub: Subscription;

  public getControlType(): ControlType {
    return ControlType.ComboBox;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value;
  }

  protected setValueJson(value: string): void {
    const val: string = value != null ? value : String.empty();
    this.orgValue = val;
    this.setValue(val);
  }

  public getEntries(): DataList {
    return this.dataList;
  }

  public getCaption(): string {
    const caption: string = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public getEditStyle(): EditStyle {
    const editStyle: EditStyle = this.getPropertyStore().getEditStyle();
    return editStyle != null ? editStyle : EditStyle.ListValuesInput;
  }

  public getListType(): DataSourceType {
    const listType: DataSourceType = this.getPropertyStore().getListType();
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
    const comp: ComboBoxComponent = this.getComponent();
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

  protected getComponentRef(): ComponentRef<ComboBoxComponent> {
    return super.getComponentRef() as ComponentRef<ComboBoxComponent>;
  }

  protected getComponent(): ComboBoxComponent {
    const compRef: ComponentRef<ComboBoxComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
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
    return this.value !== this.orgValue;
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
      this.dataList = null;
    } else if (listCount > 0) {
      const newDataList: DataList = new DataList();
      for (const row of listJson.rows) {
        const pk: string = row.pk != null ? row.pk : String.empty();
        const value: string = row.value != null ? row.value : String.empty();
        newDataList.push(new DataListEntry(pk, value));
      }
      this.dataList = newDataList;
    }
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(null);
  }

  protected attachEvents(instance: ComboBoxComponent): void {
    super.attachEvents(instance);

    if (this.getEvents() & ClientEventType.OnSelectionChanged) {
      this.selectionChangedSub = instance.selectionChanged.subscribe(() => this.getOnSelectionChangedSubscription()());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.selectionChangedSub) {
      this.selectionChangedSub.unsubscribe();
    }
  }

  protected ctrlEnterCompleted(clientEvent: ClientEnterEvent, payload: any, processedEvent: any): void {
    this.getComponent().onAfterEnter();
  }

  public hasOnSelectionChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectionChanged) ? true : false;
  }

  protected getOnSelectionChangedSubscription(): () => void {
    return () => this.getEventsService().fireSelectionChanged(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientSelectionChangedEvent>(
        this.canExecuteSelectionChanged.bind(this),
        this.onSelectionChangedExecuted.bind(this),
        this.onSelectionChangedCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectionChanged(clientEvent: ClientSelectionChangedEvent, payload: any): boolean {
    return this.hasOnSelectionChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectionChangedExecuted(clientEvent: ClientSelectionChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectionChangedCompleted(clientEvent: ClientSelectionChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public getState(): any {
    const json: any = super.getState();
    json.value = this.getValueJson();

    if (this.dataList) {
      json.entries = this.dataList;
    }

    return json;
  }

  protected setState(json: any): void {
    super.setState(json);

    this.setValueJson(json.value);

    if (json.entries && json.entries.length) {
      const entries: DataList = new DataList();
      entries.deserialize(json.entries);
      this.dataList = entries;
    }
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused;
  }
}
