import { ComponentRef, ComponentFactory, Component, NgModule, Compiler } from '@angular/core';

import { IListViewLayoutControl } from 'app/layout/listview-layout/listview-layout-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IListViewTemplateVariableWrapperOptions, ListViewTemplateVariableWrapper } from 'app/wrappers/listview-template-variable-wrapper';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemWrapper, IListViewItemWrapperOptions } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemContentModule } from 'app/controls/listview/listview-item-content.module';
import { ListViewTemplateDataSourceWrapper } from 'app/wrappers/listview-template-datasource-wrapper';
import { TextFormat } from 'app/enums/text-format';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { ListViewLayout } from 'app/layout/listview-layout/listview-layout';
import { ControlEvent } from 'app/enums/control-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientSelectionChangedEvent } from 'app/common/events/client-selection-changed-event';
import { Visibility } from 'app/enums/visibility';
import { ClientItemActivatedEvent } from 'app/common/events/client-item-activated-event';

export class ListViewWrapper extends ControlWrapper implements IListViewLayoutControl {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private compiler: Compiler;
  private patternFormatService: PatternFormatService;
  private mobileSelectionModeEnabled: boolean;
  private templateHtml: string;
  private templateCss: string;
  private templateDataSources: Array<ListViewTemplateDataSourceWrapper> = new Array<ListViewTemplateDataSourceWrapper>();
  private templateVariables: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();
  private items: Array<ListViewItemWrapper> = new Array<ListViewItemWrapper>();
  private itemFactory: ComponentFactory<ListViewItemContentComponent>;

  protected init(): void {
    super.init();
    this.compiler = this.getInjector().get(Compiler);
    this.patternFormatService = this.getInjector().get(PatternFormatService);
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

  public getIsMobileLayout(): boolean {
    return this.getPlatformService().isMobile();
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

  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    const horizontalContentAlignment: HorizontalContentAlignment = this.getPropertyStore().getHorizontalContentAlignment();
    return horizontalContentAlignment != null ? horizontalContentAlignment : HorizontalContentAlignment.Left;
  }

  public getVerticalContentAlignment(): VerticalContentAlignment {
    const verticalContentAlignment: VerticalContentAlignment = this.getPropertyStore().getVerticalContentAlignment();
    return verticalContentAlignment != null ? verticalContentAlignment : VerticalContentAlignment.Top;
  }

  public getItemMinWidth(): number {
    return Number.zeroIfNull(this.getPropertyStore().getItemMinWidth());
  }

  public getItemMinHeight(): number {
    return Number.zeroIfNull(this.getPropertyStore().getItemMinHeight());
  }

  public getTemplateHtml(): string {
    return this.getPropertyStore().getTemplateHtml();
  }

  public getTemplateCss(): string {
    return this.getPropertyStore().getTemplateCss();
  }

  public getViewTemplate(): string {
    return this.templateHtml;
  }

  public getViewTemplateCss(): string {
    return this.templateCss;
  }

  public getItemFactory(): ComponentFactory<ListViewItemContentComponent> {
    return this.itemFactory;
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
    return this.getSelectionMode() !== ListViewSelectionMode.None && this.mobileSelectionModeEnabled;
  }

  public setMobileSelectionModeEnabled(enabled: boolean): void {
    if (this.getSelectionMode() !== ListViewSelectionMode.None) {
      this.mobileSelectionModeEnabled = enabled;
    }
  }

  public ensureSingleSelection(itemWrapper: ListViewItemWrapper): void {
    for (const item of this.items) {
      if (item !== itemWrapper) {
        item.setSelected(false);
        item.updateComponent();
      }
    }
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

  public getSelectedItemsJson(): Array<string> {
    return this.getSelectedItems().map(i => i.getId());
  }

  protected setPropertiesJson(propertiesJson: any): void {
    super.setPropertiesJson(propertiesJson);

    if (propertiesJson.templateDataSourceList && propertiesJson.templateDataSourceList.length) {
      this.templateDataSources = this.parseTemplateDataSourceList(propertiesJson.templateDataSourceList);
    }

    this.templateHtml = this.parseViewTemplate();
    this.templateCss = this.getPropertyStore().getTemplateCss();

    if (String.isNullOrWhiteSpace(this.templateHtml)) {
      this.setErrorTemplate();
    }

    this.itemFactory = this.compileListViewItemComponent();
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
        const valueMap: Map<string, string> = new Map<string, string>();

        if (itemJson.values && itemJson.values.length) {
          for (const value of itemJson.values) {
            valueMap.set(decodeURIComponent(value.name), decodeURIComponent(value.value));
          }
        }

        const values: Array<ListViewItemValueWrapper> = this.getValueList(valueMap);

        if (isNew) {
          this.items.push(new ListViewItemWrapper(this, this.getInjector(), { id, pos, values }));
        } else {
          const item: ListViewItemWrapper = this.items.find(i => i.getId() === id);
          if (item) {
            item.setPosJson(pos);
            item.setValuesJson(values);
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

  private getValueList(valueMap: Map<string, string>): Array<ListViewItemValueWrapper> {
    const values: Array<ListViewItemValueWrapper> = new Array<ListViewItemValueWrapper>();

    for (const templateVar of this.templateVariables) {
      const valueStr: string = valueMap.get(templateVar.getDataSource().getName());
      values.push(new ListViewItemValueWrapper(valueStr, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return values;
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

  private parseViewTemplate(): string {
    let template: string = this.getTemplateHtml();

    if (String.isNullOrWhiteSpace(template)) {
      return null;
    }

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/gm;
    const matches: RegExpMatchArray = template.match(regEx);

    if (!matches || !matches.length) {
      return template;
    }

    for (let i = 0; i < matches.length; i++) {
      const matchTrimmed: string = matches[i].trimStringLeft('{{').trimCharsRight('}}').trim();
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
            throw new Error(`Could not find TemplateDataSource '${dsStr}' for TemplateVariable with index ${i}!`);
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

      template = template.replace(matches[i], `{{ values[${i}] }}`);
    }

    return template;
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

  private setErrorTemplate(): void {
    this.templateHtml = '<div class="wrapper">Template NULL</div>';
    this.templateCss = '.wrapper { display: flex; justify-content: center; align-items: center; }';
  }

  private clearItems(): void {
    for (const item of this.items) {
      item.detachComponent();
    }

    this.items = new Array<ListViewItemWrapper>();
  }

  private compileListViewItemComponent(): ComponentFactory<ListViewItemContentComponent> {
    const listViewItemHostCss: string = ':host { flex: 1; display: flex; flex-direction: column; }';

    const listViewItemComp = Component({ selector: ListViewItemContentComponent.SELECTOR, template: this.templateHtml, styles: [listViewItemHostCss, this.templateCss] })(ListViewItemContentComponent);
    const listViewItemMod = NgModule({ declarations: [listViewItemComp] })(ListViewItemContentModule);

    const factory: ComponentFactory<ListViewItemContentComponent> = this.compiler.compileModuleAndAllComponentsSync(listViewItemMod).componentFactories[0];

    return factory;
  }

  public hasOnItemSelectionChangedEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnItemSelectionChanged) ? true : false;
  }

  public callOnItemSelectionChanged(): void {
    if (this.hasOnItemSelectionChangedEvent()) {
      this.getEventsService().fireItemSelectionChanged(
        this.getForm().getId(),
        this.getName(),
        null,
        new InternalEventCallbacks<ClientSelectionChangedEvent>(
          this.canExecuteItemSelectionChanged.bind(this),
          this.onItemSelectionChangedExecuted.bind(this),
          this.onItemSelectionChangedCompleted.bind(this)
        )
      );
    }
  }

  protected canExecuteItemSelectionChanged(originalEvent: any, clientEvent: ClientSelectionChangedEvent): boolean {
    return this.hasOnItemSelectionChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemSelectionChangedExecuted(originalEvent: any, clientEvent: ClientSelectionChangedEvent): void {
    // Override in subclasses
  }

  protected onItemSelectionChangedCompleted(originalEvent: any, clientEvent: ClientSelectionChangedEvent): void {
    // Override in subclasses
  }

  public hasOnItemActivatedEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnItemActivated) ? true : false;
  }

  public callOnItemActivated(itemId: string): void {
    if (this.hasOnItemActivatedEvent()) {
      this.getEventsService().fireItemActivated(
        this.getForm().getId(),
        this.getName(),
        itemId,
        this.items.findIndex(i => i.getId() === itemId),
        event,
        new InternalEventCallbacks<ClientItemActivatedEvent>(
          this.canExecuteItemActivated.bind(this),
          this.onItemActivatedExecuted.bind(this),
          this.onItemActivatedCompleted.bind(this)
        )
      );
    }
  }

  protected canExecuteItemActivated(originalEvent: any, clientEvent: ClientItemActivatedEvent): boolean {
    return this.hasOnItemActivatedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onItemActivatedExecuted(originalEvent: any, clientEvent: ClientItemActivatedEvent): void {
    // Override in subclasses
  }

  protected onItemActivatedCompleted(originalEvent: any, clientEvent: ClientItemActivatedEvent): void {
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
        this.items.push(new ListViewItemWrapper(this, this.getInjector(), { state: itemJson }));
      }
    }

    this.itemFactory = this.compileListViewItemComponent();
  }
}
