import { ComponentRef, ComponentFactory, Component, NgModule, Compiler } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewTemplateVariableWrapper, IListViewTemplateVariableOptions } from 'app/wrappers/listview-template-variable-wrapper';
import { ListViewItemValue } from 'app/wrappers/listview-item-value-wrapper';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemContentModule } from 'app/controls/listview/listview-item-content.module';
import { StyleUtil } from 'app/util/style-util';

export class ListViewWrapper extends ControlWrapper {

  private propertiesLoaded: boolean = false;
  private dataLoaded: boolean = false;

  private compiler: Compiler;
  private templateHtml: string;
  private templateCss: string;
  private templateVars: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();
  private items: Array<ListViewItemWrapper> = new Array<ListViewItemWrapper>();
  private itemFactory: ComponentFactory<ListViewItemContentComponent>;

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
    this.templateHtml = this.parseViewTemplate();
    this.templateCss = this.getPropertyStore().getTemplateCss();

    if (!this.propertiesLoaded) {
      this.propertiesLoaded = true;
      propertiesJson.templateVars =
        [
          {
            index: 0,
            dsType: 1,
            format: 15
          },
          {
            index: 1,
            dsType: 1,
            format: 15
          },
          {
            index: 2,
            dsType: 8,
            format: 10,
            pattern: '#.##0.00'
          }
        ];
    }

    if (propertiesJson.templateVars && propertiesJson.templateVars.length) {
      this.templateVars = this.parseTemplateVars(propertiesJson.templateVars);
    }

    if (String.isNullOrWhiteSpace(this.templateHtml)) {
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

    let tempDataJson: any = dataJson;

    if (!this.dataLoaded) {
      this.dataLoaded = true;
      tempDataJson = {
        listViewData: this.createListViewData()
      };
    }

    if (!tempDataJson || !tempDataJson.listViewData || !tempDataJson.listViewData.items) {
      return;
    }

    for (const item of tempDataJson.listViewData.items) {
      const id: string = item.id;
      const values: Array<ListViewItemValue> = new Array<ListViewItemValue>();

      if (item.values && item.values.length) {
        for (let i = 0; i < item.values.length; i++) {
          values.push(new ListViewItemValue(this.templateVars[i].getDataSourceType(), decodeURIComponent(item.values[i])));
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

    const regEx: RegExp = /\{{2}([^}]|}[^}])*\}{2}/gm;
    const matches: RegExpMatchArray = template.match(regEx);

    if (!matches || !matches.length) {
      return template;
    }

    for (let i = 0; i < matches.length; i++) {
      template = template.replace(matches[i], `{{ values[${i}] }}`);
    }

    return template;
  }

  private parseTemplateVars(templateVarsJson: Array<any>): Array<ListViewTemplateVariableWrapper> {
    if (!templateVarsJson || !templateVarsJson.length) {
      return null;
    }

    const templateVars: Array<ListViewTemplateVariableWrapper> = new Array<ListViewTemplateVariableWrapper>();

    for (let templateVarJson of templateVarsJson) {
      let varOptions: IListViewTemplateVariableOptions = null;

      if (templateVarJson.format || String.isNullOrWhiteSpace(templateVarJson.pattern)) {
        varOptions = {
          format: templateVarJson.format,
          formatPattern: templateVarJson.pattern
        }
      }

      templateVars.push(new ListViewTemplateVariableWrapper(templateVarJson.index, templateVarJson.dsType, varOptions));
    }

    return templateVars;
  }

  private setErrorTemplate(): void {
    this.templateHtml = '<div class="wrapper">Template NULL</div>';
    this.templateCss = '.wrapper { display: flex; justify-content: center; align-items: center; }';
  }

  private compileListViewItemComponent(): ComponentFactory<ListViewItemContentComponent> {
    const listVIewItemComp = Component({ selector: ListViewItemContentComponent.SELECTOR, template: this.templateHtml, styles:[this.templateCss] })(ListViewItemContentComponent);
    const listVIewItemMod = NgModule({ declarations: [listVIewItemComp] })(ListViewItemContentModule);

    const factory: ComponentFactory<ListViewItemContentComponent> = this.compiler.compileModuleAndAllComponentsSync(listVIewItemMod).componentFactories[0];

    return factory;
  }

  private createListViewData(): any {
    const items: Array<any> = new Array<any>();

    for (let i = 0; i < 20; i++) {
      const itemJson: any = {
        id: i.toString(),
        values: [
          `Test ${i}`,
          `Text ${i}`,
          i
        ]
      };

      items.push(itemJson);
    }

    return { items };
  }
}
