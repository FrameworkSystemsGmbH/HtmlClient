import { ComponentFactory, ComponentRef } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { ListViewComponent } from '@app/controls/listview/listview.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { ListViewItemArrangement } from '@app/enums/listview-item-arrangement';
import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';
import { ListViewSelectorPosition } from '@app/enums/listview-selector-position';
import { TextFormat } from '@app/enums/text-format';
import { Visibility } from '@app/enums/visibility';
import { LayoutBase } from '@app/layout/layout-base';
import { ListViewLayout } from '@app/layout/listview-layout/listview-layout';
import { IListViewLayoutControl } from '@app/layout/listview-layout/listview-layout-control.interface';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ListViewItemValueWrapper } from '@app/wrappers/listview-item-value-wrapper';
import { ListViewItemWrapper } from '@app/wrappers/listview-item-wrapper';
import { ListViewTemplateDataSourceWrapper } from '@app/wrappers/listview-template-datasource-wrapper';
import { IListViewTemplateVariableWrapperOptions, ListViewTemplateVariableWrapper } from '@app/wrappers/listview-template-variable-wrapper';

export interface IHeaderOptions {
  height: number;
  buttonWidth: number;
  fontSize: number;
}

export class ListViewWrapper extends ControlWrapper implements IListViewLayoutControl {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private _baseControlStyle: PropertyStore | null = null;
  private _mobileSelectionModeEnabled: boolean = false;
  private _templateHtml: string | null = null;
  private _templateCss: string | null = null;
  private _templateDataSources: Array<ListViewTemplateDataSourceWrapper> = new Array<ListViewTemplateDataSourceWrapper>();
  private _templateVariables: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();
  private _items: Array<ListViewItemWrapper> = new Array<ListViewItemWrapper>();

  private get baseControlStyle(): PropertyStore {
    if (this._baseControlStyle == null) {
      this._baseControlStyle = new PropertyStore();
      const data: PropertyData | null = this.getControlStyleService().getBaseControlStyle();
      if (data != null) {
        this._baseControlStyle.setLayer(PropertyLayer.ControlStyle, data);
      }
    }

    return this._baseControlStyle;
  }

  protected init(): void {
    this._templateDataSources = new Array<ListViewTemplateDataSourceWrapper>();
    this._templateVariables = new Array<ListViewTemplateVariableWrapper>();
    this._items = new Array<ListViewItemWrapper>();
  }

  public getControlType(): ControlType {
    return ControlType.ListView;
  }

  protected createLayout(): LayoutBase {
    return new ListViewLayout(this);
  }

  protected getComponentRef(): ComponentRef<ListViewComponent> | null {
    return super.getComponentRef() as ComponentRef<ListViewComponent> | null;
  }

  protected getComponent(): ListViewComponent | null {
    const compRef: ComponentRef<ListViewComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getListViewItemCssGlobal(): string | null {
    const globalCss: string | undefined = this.baseControlStyle.getListViewItemCssGlobal();
    return globalCss != null ? globalCss : null;
  }

  public getSelectionMode(): ListViewSelectionMode {
    const selectionMode: ListViewSelectionMode | undefined = this.getPropertyStore().getSelectionMode();
    return selectionMode != null ? selectionMode : ListViewSelectionMode.None;
  }

  public getSelectorPosition(): ListViewSelectorPosition {
    const selectorPosition: ListViewSelectorPosition | undefined = this.getPropertyStore().getSelectorPosition();
    return selectorPosition != null ? selectorPosition : ListViewSelectorPosition.TopRight;
  }

  public getHeaderOptions(): IHeaderOptions {
    if (this.getPlatformService().isNative()) {
      return {
        height: 40,
        buttonWidth: 60,
        fontSize: 14
      };
    } else {
      return {
        height: 20,
        buttonWidth: 50,
        fontSize: 12
      };
    }
  }

  public getItemArrangement(): ListViewItemArrangement {
    const itemArrangement: ListViewItemArrangement | undefined = this.getPropertyStore().getItemArrangement();
    return itemArrangement != null ? itemArrangement : ListViewItemArrangement.List;
  }

  public getSpacingHorizontal(): number {
    return Number.zeroIfNull(this.getPropertyStore().getHorizontalSpacing());
  }

  public getSpacingVertical(): number {
    return Number.zeroIfNull(this.getPropertyStore().getVerticalSpacing());
  }

  public getItemWidth(): number {
    return Number.zeroIfNull(this.getPropertyStore().getItemWidth());
  }

  public getItemHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getItemHeight());
  }

  public getTemplateCss(): string | null {
    const templateCss: string | undefined = this.getPropertyStore().getTemplateCss();
    return templateCss != null ? templateCss : null;
  }

  public getTemplateHtml(): string | null {
    const templateHtml: string | undefined = this.getPropertyStore().getTemplateHtml();
    return templateHtml != null ? templateHtml : null;
  }

  public getViewTemplateCss(): string | null {
    return this._templateCss;
  }

  public getViewTemplateHtml(): string | null {
    return this._templateHtml;
  }

  public getItems(): Array<ListViewItemWrapper> {
    return this._items;
  }

  public getSelectedItems(): Array<ListViewItemWrapper> {
    return this._items.filter(i => i.getSelected());
  }

  public getItemCount(): number {
    return this._items.length;
  }

  public getMobileSelectionModeEnabled(): boolean {
    return this.getSelectionMode() === ListViewSelectionMode.Multiple && this._mobileSelectionModeEnabled;
  }

  public setMobileSelectionModeEnabled(enabled: boolean): void {
    if (this.getSelectionMode() === ListViewSelectionMode.Multiple) {
      this._mobileSelectionModeEnabled = enabled;
    }
  }

  public setIsEditableAction(value: boolean): void {
    for (const item of this._items) {
      item.markAsContentChanged();
    }

    super.setIsEditableAction(value);
  }

  public ensureSingleSelection(itemWrapper: ListViewItemWrapper): void {
    for (const item of this._items) {
      if (item !== itemWrapper) {
        item.setSelected(false);
        item.updateComponent();
      }
    }
  }

  public selectAll(): void {
    if (this.getSelectionMode() !== ListViewSelectionMode.Multiple) {
      return;
    }

    for (const item of this._items) {
      item.setSelected(true);
      item.updateComponent();
    }

    this.callOnItemSelectionChanged();
  }

  public selectNone(): void {
    if (this.getSelectionMode() === ListViewSelectionMode.None) {
      return;
    }

    for (const item of this._items) {
      item.setSelected(false);
      item.updateComponent();
    }

    this.callOnItemSelectionChanged();
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ListViewComponent> {
    const factory: ComponentFactory<ListViewComponent> = this.getResolver().resolveComponentFactory(ListViewComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  private hasChanges(): boolean {
    return this._items.filter(i => i.hasSelectionChanged()).length > 0;
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
        selectedItems: this.getSelectedItemsJson()
      }
    };

    return controlJson;
  }

  public canReceiveKeyboardFocus(): boolean {
    return false;
  }

  public getSelectedItemsJson(): Array<string> {
    return this.getSelectedItems().map(i => i.getId());
  }

  protected setPropertiesJson(propertiesJson: any): void {
    super.setPropertiesJson(propertiesJson);

    if (propertiesJson.templateDataSourceList && propertiesJson.templateDataSourceList.length) {
      const parsedDataSources: Array<ListViewTemplateDataSourceWrapper> | null = this.parseTemplateDataSourceList(propertiesJson.templateDataSourceList);
      this._templateDataSources = parsedDataSources != null ? parsedDataSources : new Array<ListViewTemplateDataSourceWrapper>();
    }

    this._templateCss = this.getTemplateCss();
    this._templateHtml = this.parseViewTemplate();

    if (this._templateHtml == null || this._templateHtml.trim().length === 0) {
      this.setErrorTemplate();
    }
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (dataJson) {
      if (dataJson.listViewData) {
        if (dataJson.listViewData.allItemsDeleted) {
          this.clearItems();
        }

        if (dataJson.listViewData.items) {
          this.setItemsJson(dataJson.listViewData.items);
        }
      }

      this.setSelectedItemsJson(dataJson.selectedItems);
    }
  }

  protected setItemsJson(itemsJson: any): void {
    for (const itemJson of itemsJson) {
      const id: string = itemJson.id;

      if (itemJson.deleted) {
        const item: ListViewItemWrapper | undefined = this._items.find(i => i.getId() === id);
        if (item) {
          item.detachComponent();
          this._items.remove(item);
        }
      } else {
        const isNew: boolean = itemJson.new;
        const pos: number = itemJson.pos;
        const dsValueMap: Map<string, string> = new Map<string, string>();

        if (itemJson.values && itemJson.values.length) {
          for (const value of itemJson.values) {
            dsValueMap.set(value.name, value.value);
          }
        }

        const templateValues: Array<ListViewItemValueWrapper> = this.getTemplateValues(dsValueMap);

        if (isNew) {
          this._items.push(new ListViewItemWrapper(this.getInjector(), { id, listViewWrapper: this, pos, values: templateValues }));
        } else {
          const item: ListViewItemWrapper | undefined = this._items.find(i => i.getId() === id);
          if (item) {
            item.setPosJson(pos);
            item.setValuesJson(templateValues);
          }
        }
      }
    }

    this._items = this._items.sort((a, b) => {
      const aPos: number | null = a.getPos();
      const bPos: number | null = b.getPos();

      if (aPos == null && bPos == null) {
        return 0;
      } else if (bPos == null) {
        return 1;
      } else if (aPos == null) {
        return -1;
      } else if (aPos > bPos) {
        return 1;
      } else if (aPos < bPos) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private getTemplateValues(valueMap: Map<string, string>): Array<ListViewItemValueWrapper> {
    const templateValues: Array<ListViewItemValueWrapper> = new Array<ListViewItemValueWrapper>();

    for (const templateVar of this._templateVariables) {
      const valueStr: string | undefined = valueMap.get(templateVar.getDataSource().getName());
      templateValues.push(new ListViewItemValueWrapper(valueStr != null ? valueStr : null, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return templateValues;
  }

  private setSelectedItemsJson(selectedItemsJson: any): void {
    let selectedIds: Array<string> = selectedItemsJson && selectedItemsJson.length ? selectedItemsJson : new Array<string>();

    if (this.getSelectionMode() === ListViewSelectionMode.Single && selectedIds.length > 1) {
      selectedIds = new Array<string>(selectedIds[0]);
    }

    for (const item of this._items) {
      if (selectedIds.find(id => id === item.getId())) {
        item.setSelectedJson(true);
      } else {
        item.setSelectedJson(false);
      }
    }
  }

  private parseTemplateDataSourceList(templateDataSourceListJson: Array<any> | null): Array<ListViewTemplateDataSourceWrapper> | null {
    if (!templateDataSourceListJson || !templateDataSourceListJson.length) {
      return null;
    }

    const templateDataSourceList: Array<ListViewTemplateDataSourceWrapper> = new Array<ListViewTemplateDataSourceWrapper>();

    for (const templateDataSourceJson of templateDataSourceListJson) {
      templateDataSourceList.push(new ListViewTemplateDataSourceWrapper(templateDataSourceJson.dataSourceName, templateDataSourceJson.dataSourceTypeID));
    }

    return templateDataSourceList;
  }

  private parseViewTemplate(): string | null {
    let templateHtml: string | null = this.getTemplateHtml();

    this._templateVariables = new Array<ListViewTemplateVariableWrapper>();

    if (templateHtml == null || !templateHtml.trim().length) {
      return null;
    }

    const filesUrl: string | null = this.getImageService().getFilesUrl();

    if (filesUrl != null) {
      templateHtml = templateHtml.replace(/%FILESURL%/g, filesUrl);
    }

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/g;
    const matches: RegExpMatchArray | null = templateHtml.match(regEx);

    if (!matches || !matches.length) {
      return templateHtml;
    }

    matches.forEach((match, index) => {
      const matchTrimmed: string = match.trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let ds: ListViewTemplateDataSourceWrapper | undefined;
      let format: TextFormat | undefined;
      let formatPattern: string | undefined;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (partTrimmed.length === 0) {
          continue;
        }

        let partIndex: number = partTrimmed.indexOf(ListViewWrapper.PART_DS);

        if (partIndex >= 0) {
          const dsStr: string = partTrimmed.substr(partIndex + ListViewWrapper.PART_DS.length);
          ds = this._templateDataSources.find(tds => tds.getName() === dsStr);

          if (ds == null) {
            throw new Error(`Could not find TemplateDataSource '${dsStr}' for TemplateVariable '${match}'!`);
          }

          continue;
        }

        partIndex = partTrimmed.indexOf(ListViewWrapper.PART_F);

        if (partIndex >= 0) {
          const formatStr: string = partTrimmed.substr(partIndex + ListViewWrapper.PART_F.length);
          format = parseInt(formatStr, 10);
          continue;
        }

        partIndex = partTrimmed.indexOf(ListViewWrapper.PART_FP);

        if (partIndex >= 0) {
          const formatPatternStr: string = partTrimmed.substr(partIndex + ListViewWrapper.PART_FP.length);
          formatPattern = this.getPatternFormatService().javaToMoment(formatPatternStr);
          continue;
        }
      }

      if (ds != null) {
        let options: IListViewTemplateVariableWrapperOptions | undefined;

        if (format != null || formatPattern != null) {
          options = {
            format,
            formatPattern
          };
        }

        this._templateVariables.push(new ListViewTemplateVariableWrapper(ds, options));

        if (templateHtml != null) {
          templateHtml = templateHtml.replace(match, `{{${index}}}`);
        }
      }
    });

    return templateHtml;
  }

  private setErrorTemplate(): void {
    this._templateCss = '.lvItem { display: flex; align-items: center; justify-content: center; }';
    this._templateHtml = 'Template NULL';
  }

  private clearItems(): void {
    for (const item of this._items) {
      item.detachComponent();
    }

    this._items = new Array<ListViewItemWrapper>();
  }

  public hasOnItemSelectionChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnItemSelectionChanged) === ClientEventType.OnItemSelectionChanged;
  }

  public callOnItemSelectionChanged(): void {
    if (this.hasOnItemSelectionChangedEvent()) {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireItemSelectionChanged(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteItemSelectionChanged.bind(this),
            this.onItemSelectionChangedExecuted.bind(this),
            this.onItemSelectionChangedCompleted.bind(this)
          )
        );
      }
    }
  }

  protected canExecuteItemSelectionChanged(payload: any): boolean {
    return this.hasOnItemSelectionChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemSelectionChangedExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onItemSelectionChangedCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public hasOnItemActivatedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnItemActivated) === ClientEventType.OnItemActivated;
  }

  public callOnItemActivated(itemId: string): void {
    if (this.hasOnItemActivatedEvent()) {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireItemActivated(
          form.getId(),
          this.getName(),
          itemId,
          this._items.findIndex(i => i.getId() === itemId),
          new InternalEventCallbacks(
            this.canExecuteItemActivated.bind(this),
            this.onItemActivatedExecuted.bind(this),
            this.onItemActivatedCompleted.bind(this)
          )
        );
      }
    }
  }

  protected canExecuteItemActivated(payload: any): boolean {
    return this.hasOnItemActivatedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemActivatedExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onItemActivatedCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public saveState(): any {
    const json: any = super.saveState();

    json.mobileSelectionModeEnabled = this._mobileSelectionModeEnabled;
    json.templateCss = this._templateCss;
    json.templateHtml = this._templateHtml;

    const dataSourcesJson: Array<any> = new Array<any>();

    for (const templateDataSource of this._templateDataSources) {
      dataSourcesJson.push({
        name: templateDataSource.getName(),
        dsType: templateDataSource.getDataSourceType()
      });
    }

    if (dataSourcesJson.length) {
      json.templateDataSources = dataSourcesJson;
    }

    const variablesJson: Array<any> = new Array<any>();

    for (const templateVariable of this._templateVariables) {
      variablesJson.push({
        dsName: templateVariable.getDataSource().getName(),
        format: templateVariable.getFormat(),
        formatPattern: templateVariable.getFormatPattern()
      });
    }

    if (variablesJson.length) {
      json.templateVariables = variablesJson;
    }

    const itemsJson: Array<any> = new Array<any>();

    for (const item of this._items) {
      itemsJson.push(item.saveState());
    }

    if (itemsJson.length) {
      json.items = itemsJson;
    }

    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    this._mobileSelectionModeEnabled = json.mobileSelectionModeEnabled;
    this._templateCss = json.templateCss;
    this._templateHtml = json.templateHtml;

    if (json.templateDataSources && json.templateDataSources.length) {
      for (const dsJson of json.templateDataSources) {
        this._templateDataSources.push(new ListViewTemplateDataSourceWrapper(dsJson.name, dsJson.dsType));
      }
    }

    if (json.templateVariables && json.templateVariables.length) {
      for (const varJson of json.templateVariables) {
        const ds: ListViewTemplateDataSourceWrapper | undefined = this._templateDataSources.find(d => d.getName() === varJson.dsName);
        const format: TextFormat | undefined = varJson.format;
        const formatPattern: string | undefined = varJson.formatPattern;

        if (ds != null) {
          let options: IListViewTemplateVariableWrapperOptions | undefined;

          if (format != null || formatPattern != null) {
            options = {
              format,
              formatPattern
            };
          }

          this._templateVariables.push(new ListViewTemplateVariableWrapper(ds, options));
        }
      }
    }

    if (json.items && json.items.length) {
      for (const itemJson of json.items) {
        this._items.push(new ListViewItemWrapper(this.getInjector(), { listViewWrapper: this, state: itemJson }));
      }
    }
  }
}
