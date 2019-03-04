import { ComponentRef, ComponentFactory, Component, NgModule, Compiler } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IListViewTemplateVariableWrapperOptions, ListViewTemplateVariableWrapper } from 'app/wrappers/listview-template-variable-wrapper';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemContentModule } from 'app/controls/listview/listview-item-content.module';
import { ListViewTemplateDataSourceWrapper } from 'app/wrappers/listview-template-datasource-wrapper';
import { TextFormat } from 'app/enums/text-format';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';

export class ListViewWrapper extends ControlWrapper {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private compiler: Compiler;
  private patternFormatService: PatternFormatService;
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

  public getItemMaxWidth(): number {
    return Number.maxIfNull(this.getPropertyStore().getItemMaxWidth());
  }

  public getItemMaxHeight(): number {
    return Number.maxIfNull(this.getPropertyStore().getItemMaxHeight());
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

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ListViewComponent> {
    const factory: ComponentFactory<ListViewComponent> = this.getResolver().resolveComponentFactory(ListViewComponent);
    return factory.create(container.getViewContainerRef().injector);
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
      if (dataJson.listViewData && dataJson.listViewData.items) {
        this.setItemsJson(dataJson.listViewData.items);
      }

      if (dataJson.selectedItems && dataJson.selectedItems.length) {
        this.setSelectedItemsJson(dataJson.selectedItems);
      }
    }
  }

  protected setItemsJson(itemsJson: any): void {
    for (const itemJson of itemsJson) {
      const id: string = itemJson.id;
      const isNew: boolean = itemJson.new;
      const valueMap: Map<string, string> = new Map<string, string>();

      if (itemJson.values && itemJson.values.length) {
        for (const value of itemJson.values) {
          valueMap.set(decodeURIComponent(value.name), decodeURIComponent(value.value));
        }
      }

      if (isNew) {
        const values: Array<ListViewItemValueWrapper> = new Array<ListViewItemValueWrapper>();
        for (const templateVar of this.templateVariables) {
          const valueStr: string = valueMap.get(templateVar.getDataSource().getName());
          values.push(new ListViewItemValueWrapper(valueStr, templateVar.getFormat(), templateVar.getFormatPattern()));
        }

        this.items.push(new ListViewItemWrapper(id, values));
      } else {

      }
    }
  }

  protected setSelectedItemsJson(selectedItemsJson: any): void {

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
          format = parseInt(formatStr);
          continue;
        }

        index = partTrimmed.indexOf(ListViewWrapper.PART_FP);

        if (index >= 0) {
          const formatPatternStr:string = partTrimmed.substr(index + ListViewWrapper.PART_FP.length);
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

  private compileListViewItemComponent(): ComponentFactory<ListViewItemContentComponent> {
    const listViewItemHostCss: string = ':host { flex: 1; display: flex; flex-direction: column; }'

    const listViewItemComp = Component({ selector: ListViewItemContentComponent.SELECTOR, template: this.templateHtml, styles: [listViewItemHostCss, this.templateCss] })(ListViewItemContentComponent);
    const listViewItemMod = NgModule({ declarations: [listViewItemComp] })(ListViewItemContentModule);

    const factory: ComponentFactory<ListViewItemContentComponent> = this.compiler.compileModuleAndAllComponentsSync(listViewItemMod).componentFactories[0];

    return factory;
  }
}
