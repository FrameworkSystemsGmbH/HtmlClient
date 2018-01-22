import { ComponentRef, ComponentFactory } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ComboBoxComponent } from 'app/controls/combobox.component';
import { ComboBoxListComponent } from 'app/controls/combobox-list/combobox-list.component';
import { ComboBoxFreeComponent } from 'app/controls/combobox-free/combobox-free.component';
import { FittedDataWrapper } from 'app/wrappers/fitted-data-wrapper';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientSelectionChangedEvent } from 'app/common/events/client-selection-changed-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ControlEvent } from 'app/enums/control-event';
import { ControlVisibility } from 'app/enums/control-visibility';
import { EditStyle } from 'app/enums/edit-style';
import { DataSourceType } from 'app/enums/datasource-type';
import { DataList } from 'app/common/data-list';
import { DataListEntry } from 'app/common/data-list-entry';

export class ComboBoxWrapper extends FittedDataWrapper {

  private value: string;
  private orgValue: string;

  private dataList: DataList;

  private onSelectionChangedSub: ISubscription;

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : encodeURIComponent(this.value);
  }

  protected setValueJson(value: string): void {
    const val: string = value != null ? decodeURIComponent(value) : String.empty();
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

  public getMaxDropDownWidth(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMaxDropDownWidth());
  }

  public getMaxDropDownHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getMaxDropDownHeight());
  }

  protected getDataMinWidth(): number {
    return this.fontService.getDataMinWidthComboBox(this);
  }

  protected getDataMaxWidth() {
    return this.fontService.getDataMaxWidthComboBox(this);
  }

  protected getDataMinHeight(): number {
    return 0;
  }

  protected getDataMaxHeight() {
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
    const compType: any = this.getEditStyle() === EditStyle.ListValuesInput ? ComboBoxListComponent : ComboBoxFreeComponent;
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
        const pk: string = row.pk != null ? decodeURIComponent(row.pk) : String.empty();
        const value: string = row.value != null ? decodeURIComponent(row.value) : String.empty();
        newDataList.push(new DataListEntry(pk, value));
      }
      this.dataList = newDataList;
    }
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(null);
  }

  protected onEnterCompleted(originalEvent: any, clientEvent: ClientEnterEvent): void {
    this.getComponent().onAfterEnter();
  }

  public hasOnSelectionChangedEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnSelectionChanged) ? true : false;
  }

  protected getOnSelectionChangedSubscription(event: any): () => void {
    return () => this.getEventsService().fireSelectionChanged(
      this.getForm().getId(),
      this.getName(),
      event,
      new InternalEventCallbacks<ClientSelectionChangedEvent>(
        this.canExecuteSelectionChanged.bind(this),
        this.onSelectionChangedExecuted.bind(this),
        this.onSelectionChangedCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectionChanged(originalEvent: any, clientEvent: ClientSelectionChangedEvent): boolean {
    return this.hasOnSelectionChangedEvent() && this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onSelectionChangedExecuted(originalEvent: any, clientEvent: ClientSelectionChangedEvent): void {
    // Override in subclasses
  }

  protected onSelectionChangedCompleted(originalEvent: any, clientEvent: ClientSelectionChangedEvent): void {
    // Override in subclasses
  }

  protected attachEvents(instance: ComboBoxComponent): void {
    super.attachEvents(instance);

    if (this.getEvents() & ControlEvent.OnSelectionChanged) {
      this.onSelectionChangedSub = instance.onSelectionChanged.subscribe(event => this.getOnSelectionChangedSubscription(event)());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onSelectionChangedSub) {
      this.onSelectionChangedSub.unsubscribe();
    }
  }
}
