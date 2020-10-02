import { ComponentRef, ComponentFactory, Injector } from '@angular/core';

import { IListViewLayoutControl } from 'app/layout/listview-layout/listview-layout-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IListViewTemplateVariableWrapperOptions, ListViewTemplateVariableWrapper } from 'app/wrappers/listview-template-variable-wrapper';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewTemplateDataSourceWrapper } from 'app/wrappers/listview-template-datasource-wrapper';
import { TextFormat } from 'app/enums/text-format';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { ListViewLayout } from 'app/layout/listview-layout/listview-layout';
import { ClientEventType } from 'app/enums/client-event-type';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientSelectionChangedEvent } from 'app/common/events/client-selection-changed-event';
import { Visibility } from 'app/enums/visibility';
import { ClientItemActivatedEvent } from 'app/common/events/client-item-activated-event';
import { ImageService } from 'app/services/image.service';
import { ListViewSelectorPosition } from 'app/enums/listview-selector-position';

export interface IHeaderOptions {
  height: number;
  buttonWidth: number;
  fontSize: number;
}

export class ListViewWrapper extends ControlWrapper implements IListViewLayoutControl {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private imageService: ImageService;
  private patternFormatService: PatternFormatService;
  private mobileSelectionModeEnabled: boolean;
  private templateHtml: string;
  private templateCss: string;
  private templateDataSources: Array<ListViewTemplateDataSourceWrapper>;
  private templateVariables: Array<ListViewTemplateVariableWrapper>;
  private items: Array<ListViewItemWrapper>;

  protected init(): void {
    super.init();
    const injector: Injector = this.getInjector();
    this.templateDataSources = new Array<ListViewTemplateDataSourceWrapper>();
    this.templateVariables = new Array<ListViewTemplateVariableWrapper>();
    this.items = new Array<ListViewItemWrapper>();
    this.imageService = injector.get(ImageService);
    this.patternFormatService = injector.get(PatternFormatService);
  }

  public getControlType(): ControlType {
    return ControlType.ListView;
  }

  protected createLayout(): LayoutBase {
    return new ListViewLayout(this);
  }

  protected getComponentRef(): ComponentRef<ListViewComponent> {
    return super.getComponentRef() as ComponentRef<ListViewComponent>;
  }

  protected getComponent(): ListViewComponent {
    const compRef: ComponentRef<ListViewComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getSelectionMode(): ListViewSelectionMode {
    const selectionMode: ListViewSelectionMode = this.getPropertyStore().getSelectionMode();
    return selectionMode != null ? selectionMode : ListViewSelectionMode.None;
  }

  public getSelectorPosition(): ListViewSelectorPosition {
    const selectorPosition: ListViewSelectorPosition = this.getPropertyStore().getSelectorPosition();
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
    const itemArrangement: ListViewItemArrangement = this.getPropertyStore().getItemArrangement();
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

  public getTemplateCss(): string {
    return this.getPropertyStore().getTemplateCss();
  }

  public getTemplateHtml(): string {
    return this.getPropertyStore().getTemplateHtml();
  }

  public getViewTemplateCss(): string {
    return this.templateCss;
  }

  public getViewTemplateHtml(): string {
    return this.templateHtml;
  }

  public getItems(): Array<ListViewItemWrapper> {
    return this.items;
  }

  public getSelectedItems(): Array<ListViewItemWrapper> {
    return this.items.filter(i => i.getSelected());
  }

  public getItemCount(): number {
    return this.items.length;
  }

  public getMobileSelectionModeEnabled(): boolean {
    return this.getSelectionMode() === ListViewSelectionMode.Multiple && this.mobileSelectionModeEnabled;
  }

  public setMobileSelectionModeEnabled(enabled: boolean): void {
    if (this.getSelectionMode() === ListViewSelectionMode.Multiple) {
      this.mobileSelectionModeEnabled = enabled;
    }
  }

  public setIsEditableAction(value: boolean): void {
    for (const item of this.items) {
      item.markAsContentChanged();
    }

    super.setIsEditableAction(value);
  }

  public ensureSingleSelection(itemWrapper: ListViewItemWrapper): void {
    for (const item of this.items) {
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

    for (const item of this.items) {
      item.setSelected(true);
      item.updateComponent();
    }

    this.callOnItemSelectionChanged();
  }

  public selectNone(): void {
    if (this.getSelectionMode() === ListViewSelectionMode.None) {
      return;
    }

    for (const item of this.items) {
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
    return this.items.filter(i => i.hasSelectionChanged()).length > 0;
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
      this.templateDataSources = this.parseTemplateDataSourceList(propertiesJson.templateDataSourceList);
    }

    this.templateCss = this.getTemplateCss();
    this.templateHtml = this.parseViewTemplate();

    if (String.isNullOrWhiteSpace(this.templateHtml)) {
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
        const item: ListViewItemWrapper = this.items.find(i => i.getId() === id);
        if (item) {
          item.detachComponent();
          this.items.remove(item);
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
          this.items.push(new ListViewItemWrapper(this.getInjector(), { id, listViewWrapper: this, pos, values: templateValues }));
        } else {
          const item: ListViewItemWrapper = this.items.find(i => i.getId() === id);
          if (item) {
            item.setPosJson(pos);
            item.setValuesJson(templateValues);
          }
        }
      }
    }

    this.items = this.items.sort((a, b) => {
      const aPos: number = a.getPos();
      const bPos: number = b.getPos();
      if (aPos > bPos) {
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

    for (const templateVar of this.templateVariables) {
      const valueStr: string = valueMap.get(templateVar.getDataSource().getName());
      templateValues.push(new ListViewItemValueWrapper(valueStr, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return templateValues;
  }

  private setSelectedItemsJson(selectedItemsJson: any): void {
    let selectedIds: Array<string> = selectedItemsJson && selectedItemsJson.length ? selectedItemsJson : new Array<string>();

    if (this.getSelectionMode() === ListViewSelectionMode.Single && selectedIds.length > 1) {
      selectedIds = new Array<string>(selectedIds[0]);
    }

    for (const item of this.items) {
      if (selectedIds.find(id => id === item.getId())) {
        item.setSelectedJson(true);
      } else {
        item.setSelectedJson(false);
      }
    }
  }

  private parseTemplateDataSourceList(templateDataSourceListJson: Array<any>): Array<ListViewTemplateDataSourceWrapper> {
    if (!templateDataSourceListJson || !templateDataSourceListJson.length) {
      return null;
    }

    const templateDataSourceList: Array<ListViewTemplateDataSourceWrapper> = new Array<ListViewTemplateDataSourceWrapper>();

    for (const templateDataSourceJson of templateDataSourceListJson) {
      templateDataSourceList.push(new ListViewTemplateDataSourceWrapper(templateDataSourceJson.dataSourceName, templateDataSourceJson.dataSourceTypeID));
    }

    return templateDataSourceList;
  }

  private parseViewTemplate(): string {
    let templateHtml: string = this.getTemplateHtml();

    this.templateVariables = new Array<ListViewTemplateVariableWrapper>();

    if (String.isNullOrWhiteSpace(templateHtml)) {
      return null;
    }

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/g;
    const matches: RegExpMatchArray = templateHtml.match(regEx);

    if (!matches || !matches.length) {
      return templateHtml;
    }

    for (const match of matches) {
      const matchTrimmed: string = match.trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let ds: ListViewTemplateDataSourceWrapper;
      let format: TextFormat;
      let formatPattern: string;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (String.isNullOrWhiteSpace(partTrimmed)) {
          continue;
        }

        let index: number = partTrimmed.indexOf(ListViewWrapper.PART_DS);

        if (index >= 0) {
          const dsStr: string = partTrimmed.substr(index + ListViewWrapper.PART_DS.length);
          ds = this.templateDataSources.find(tds => tds.getName() === dsStr);

          if (!ds) {
            throw new Error(`Could not find TemplateDataSource '${dsStr}' for TemplateVariable '${match}'!`);
          }

          continue;
        }

        index = partTrimmed.indexOf(ListViewWrapper.PART_F);

        if (index >= 0) {
          const formatStr: string = partTrimmed.substr(index + ListViewWrapper.PART_F.length);
          format = parseInt(formatStr, 10);
          continue;
        }

        index = partTrimmed.indexOf(ListViewWrapper.PART_FP);

        if (index >= 0) {
          const formatPatternStr: string = partTrimmed.substr(index + ListViewWrapper.PART_FP.length);
          formatPattern = this.patternFormatService.javaToMoment(formatPatternStr);
          continue;
        }
      }

      let options: IListViewTemplateVariableWrapperOptions = null;

      if (format || !String.isNullOrWhiteSpace(formatPattern)) {
        options = {
          format,
          formatPattern
        };
      }

      this.templateVariables.push(new ListViewTemplateVariableWrapper(ds, options));

      templateHtml = templateHtml.replace(match, `<span data-var></span>`);
    }

    // Replace placeholders
    templateHtml = templateHtml.replace(/%FILESURL%/g, this.imageService.getFilesUrl());

    return templateHtml;
  }

  private setErrorTemplate(): void {
    this.templateCss = '.lvItem { display: flex; align-items: center; justify-content: center; }';
    this.templateHtml = 'Template NULL';
  }

  private clearItems(): void {
    for (const item of this.items) {
      item.detachComponent();
    }

    this.items = new Array<ListViewItemWrapper>();
  }

  public hasOnItemSelectionChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnItemSelectionChanged) ? true : false;
  }

  public callOnItemSelectionChanged(): void {
    if (this.hasOnItemSelectionChangedEvent()) {
      this.getEventsService().fireItemSelectionChanged(
        this.getForm().getId(),
        this.getName(),
        new InternalEventCallbacks<ClientSelectionChangedEvent>(
          this.canExecuteItemSelectionChanged.bind(this),
          this.onItemSelectionChangedExecuted.bind(this),
          this.onItemSelectionChangedCompleted.bind(this)
        )
      );
    }
  }

  protected canExecuteItemSelectionChanged(clientEvent: ClientSelectionChangedEvent, payload: any): boolean {
    return this.hasOnItemSelectionChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemSelectionChangedExecuted(clientEvent: ClientSelectionChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onItemSelectionChangedCompleted(clientEvent: ClientSelectionChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public hasOnItemActivatedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnItemActivated) ? true : false;
  }

  public callOnItemActivated(itemId: string): void {
    if (this.hasOnItemActivatedEvent()) {
      this.getEventsService().fireItemActivated(
        this.getForm().getId(),
        this.getName(),
        itemId,
        this.items.findIndex(i => i.getId() === itemId),
        new InternalEventCallbacks<ClientItemActivatedEvent>(
          this.canExecuteItemActivated.bind(this),
          this.onItemActivatedExecuted.bind(this),
          this.onItemActivatedCompleted.bind(this)
        )
      );
    }
  }

  protected canExecuteItemActivated(clientEvent: ClientItemActivatedEvent, payload: any): boolean {
    return this.hasOnItemActivatedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemActivatedExecuted(clientEvent: ClientItemActivatedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onItemActivatedCompleted(clientEvent: ClientItemActivatedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public getState(): any {
    const json: any = super.getState();

    json.mobileSelectionModeEnabled = this.mobileSelectionModeEnabled;
    json.templateCss = this.templateCss;
    json.templateHtml = this.templateHtml;

    const dataSourcesJson: Array<any> = new Array<any>();

    for (const templateDataSource of this.templateDataSources) {
      dataSourcesJson.push({
        name: templateDataSource.getName(),
        dsType: templateDataSource.getDataSourceType()
      });
    }

    if (dataSourcesJson.length) {
      json.templateDataSources = dataSourcesJson;
    }

    const variablesJson: Array<any> = new Array<any>();

    for (const templateVariable of this.templateVariables) {
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

    for (const item of this.items) {
      itemsJson.push(item.getState());
    }

    if (itemsJson.length) {
      json.items = itemsJson;
    }

    return json;
  }

  protected setState(json: any): void {
    super.setState(json);

    this.mobileSelectionModeEnabled = json.mobileSelectionModeEnabled;
    this.templateCss = json.templateCss;
    this.templateHtml = json.templateHtml;

    if (json.templateDataSources && json.templateDataSources.length) {
      for (const dsJson of json.templateDataSources) {
        this.templateDataSources.push(new ListViewTemplateDataSourceWrapper(dsJson.name, dsJson.dsType));
      }
    }

    if (json.templateVariables && json.templateVariables.length) {
      for (const varJson of json.templateVariables) {
        const ds: ListViewTemplateDataSourceWrapper = this.templateDataSources.find(d => d.getName() === varJson.dsName);
        const format: TextFormat = varJson.format;
        const formatPattern: string = varJson.formatPattern;

        let options: IListViewTemplateVariableWrapperOptions = null;

        if (format || !String.isNullOrWhiteSpace(formatPattern)) {
          options = {
            format,
            formatPattern
          };
        }

        this.templateVariables.push(new ListViewTemplateVariableWrapper(ds, options));
      }
    }

    if (json.items && json.items.length) {
      for (const itemJson of json.items) {
        this.items.push(new ListViewItemWrapper(this.getInjector(), { listViewWrapper: this, state: itemJson }));
      }
    }
  }
}
