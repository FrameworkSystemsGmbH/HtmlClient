import { ComponentRef, ComponentFactory, Injector, Compiler, Component, NgModule } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewTemplateVariableWrapper, IListViewTemplateVariableOptions } from 'app/wrappers/listview-template-variable-wrapper';
import { DataSourceType } from 'app/enums/datasource-type';
import { TextFormat } from 'app/enums/text-format';
import { ListViewItemValue } from 'app/wrappers/listview-item-value-wrapper';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemComponent } from 'app/controls/listview/listview-item.component';
import { ListViewItemModule } from 'app/controls/listview/listview-item.module';
import { StyleUtil } from 'app/util/style-util';

export class ListViewWrapper extends ControlWrapper {

  private static readonly PART_DST: string = 'dst:';
  private static readonly PART_F: string = 'f:';
  private static readonly PART_FP: string = 'fp:';

  private dataLoaded: boolean = false;

  private compiler: Compiler;
  private viewTemplateHtml: string;
  private viewTemplateCss: string;
  private templateVars: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();
  private items: Array<ListViewItemWrapper> = new Array<ListViewItemWrapper>();
  private itemFactory: ComponentFactory<ListViewItemComponent>;

  protected init(): void {
    super.init();
    this.compiler = this.getInjector().get(Compiler);
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
    return this.viewTemplateHtml;
  }

  public getViewTemplateCss(): string {
    return this.viewTemplateCss;
  }

  public getItemFactory(): ComponentFactory<ListViewItemComponent> {
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
    this.viewTemplateHtml = this.parseViewTemplate();
    this.viewTemplateCss = this.getPropertyStore().getTemplateCss();
    this.templateVars = this.parseTemplateVars();

    if (String.isNullOrWhiteSpace(this.viewTemplateHtml)) {
      this.setErrorTemplate();
    }

    this.itemFactory = this.compileListViewItemComponent();
  }

  public setJson(json: any, isNew: boolean): void {
    json.data = {};
    super.setJson(json, isNew);
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!this.dataLoaded) {
      this.dataLoaded = true;
      dataJson = {
        listViewData: this.createListViewData()
      };
    }

    if (!dataJson || !dataJson.listViewData || !dataJson.listViewData.items) {
      return;
    }

    for (const item of dataJson.listViewData.items) {
      const id: string = item.id;
      const values: Array<ListViewItemValue> = new Array<ListViewItemValue>();

      if (item.values && item.values.length) {
        for (const value of item.values) {
          values.push(new ListViewItemValue(value.index, this.templateVars[value.index].getDataSourceType(), decodeURIComponent(value.value)));
        }
      }

      this.items.push(new ListViewItemWrapper(id, values));
    }
  }

  private parseViewTemplate(): string {
    let template: string = this.getTemplateHtml();

    if (String.isNullOrWhiteSpace(template)) {
      return null;
    }

    const regEx: RegExp = /{{2}[^{{|}}].*}{2}/gm;
    const matches: RegExpMatchArray = template.match(regEx);

    if (!matches || !matches.length) {
      return template;
    }

    for (let i = 0; i < matches.length; i++) {
      template = template.replace(matches[i], `{{ values[${i}] }}`);
    }

    return template;
  }

  private parseTemplateVars(): Array<ListViewTemplateVariableWrapper> {
    const template: string = this.getTemplateHtml();
    const templateVars: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();

    if (String.isNullOrWhiteSpace(template)) {
      return templateVars;
    }

    const regEx: RegExp = /{{2}[^{{|}}].*}{2}/gm;
    const matches: RegExpMatchArray = template.match(regEx);

    if (!matches || !matches.length) {
      return templateVars;
    }

    for (let i = 0; i < matches.length; i++) {
      const matchTrimmed: string = matches[i].trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let dataSourceType: DataSourceType;
      let format: TextFormat;
      let formatPattern: string;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (String.isNullOrWhiteSpace(partTrimmed)) {
          continue;
        }

        let index: number = partTrimmed.indexOf(ListViewWrapper.PART_DST);

        if (index >= 0) {
          const dst: string = partTrimmed.substr(index + ListViewWrapper.PART_DST.length);
          dataSourceType = DataSourceType[dst];
          continue;
        }

        index = partTrimmed.indexOf(ListViewWrapper.PART_F);

        if (index >= 0) {
          const f: string = partTrimmed.substr(index + ListViewWrapper.PART_F.length);
          format = TextFormat[f];
          continue;
        }

        index = partTrimmed.indexOf(ListViewWrapper.PART_FP);

        if (index >= 0) {
          formatPattern = partTrimmed.substr(index + ListViewWrapper.PART_FP.length);
          continue;
        }
      }

      let options: IListViewTemplateVariableOptions = null;

      if (format || !String.isNullOrWhiteSpace(formatPattern)) {
        options = {
          format,
          formatPattern
        };
      }

      const templateVar: ListViewTemplateVariableWrapper = new ListViewTemplateVariableWrapper(i, dataSourceType, options);

      templateVars.push(templateVar);
    }

    return templateVars;
  }

  private setErrorTemplate(): void {
    this.viewTemplateHtml = '<div class="wrapper">Template NULL</div>';
    this.viewTemplateCss = '.wrapper { display: flex; justify-content: center; align-items: center; }';
  }

  private compileListViewItemComponent(): ComponentFactory<ListViewItemComponent> {
    const styles: Array<any> = new Array<any>();

    styles.push(ListViewItemComponent.containerCss);

    const itemMinWidth: number = this.getItemMinWidth();
    const itemMinHeight: number = this.getItemMinHeight();

    const itemMinSizeCss: string = ListViewItemComponent.hostMinSizeCss
      .replace(ListViewItemComponent.hostMinWidthPlaceholder, StyleUtil.getValue('px', itemMinWidth))
      .replace(ListViewItemComponent.hostMinHeightPlaceholder, StyleUtil.getValue('px', itemMinHeight));

    styles.push(itemMinSizeCss);

    const template: string = ListViewItemComponent.containerHtml.replace(ListViewItemComponent.contentPlaceholder, this.viewTemplateHtml);

    if (!String.isNullOrWhiteSpace(this.viewTemplateCss)) {
      styles.push(this.viewTemplateCss);
    }

    const listVIewItemComp = Component({ selector: ListViewItemComponent.htmlSelector, template, styles })(ListViewItemComponent);
    const listVIewItemMod = NgModule({ declarations: [listVIewItemComp] })(ListViewItemModule);

    const factory: ComponentFactory<ListViewItemComponent> = this.compiler.compileModuleAndAllComponentsSync(listVIewItemMod).componentFactories[0];

    return factory;
  }

  private createListViewData(): any {
    const listViewData: any = {
      count: 10,
      items: []
    };

    for (let i = 0; i < 10; i++) {
      const itemJson: any = {
        id: i.toString(),
        values: [
          {
            index: 0,
            value: 'Text 1'
          },
          {
            index: 1,
            value: 'Text 2'
          },
          {
            index: 2,
            value: 3
          }
        ]
      };

      listViewData.items.push(itemJson);
    }

    return listViewData;
  }
}
