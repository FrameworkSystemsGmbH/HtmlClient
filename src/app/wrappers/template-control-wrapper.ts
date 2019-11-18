import { ComponentRef, ComponentFactory, Component, NgModule, Compiler } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { TextFormat } from 'app/enums/text-format';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { ImageService } from 'app/services/image.service';
import { TemplateControlTemplateDataSourceWrapper } from 'app/wrappers/template-control-template-datasource-wrapper';
import { TemplateControlTemplateVariableWrapper, ITemplateControlTemplateVariableWrapperOptions } from 'app/wrappers/template-control-template-variable-wrapper';
import { TemplateControlContentComponent } from 'app/controls/template-control/template-control-content.component';
import { TemplateControlComponent } from 'app/controls/template-control/template-control.component';
import { TemplateControlValueWrapper } from 'app/wrappers/template-control-value-wrapper';
import { TemplateControlContentModule } from 'app/controls/template-control/template-control-content.module';

export class TemplateControlWrapper extends ControlWrapper {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private static _factoryBuffer: Map<string, ComponentFactory<TemplateControlContentComponent>> = new Map<string, ComponentFactory<TemplateControlContentComponent>>();

  private compiler: Compiler;
  private imageService: ImageService;
  private patternFormatService: PatternFormatService;
  private templateHtml: string;
  private templateCss: string;
  private templateDataSources: Array<TemplateControlTemplateDataSourceWrapper>;
  private templateVariables: Array<TemplateControlTemplateVariableWrapper>;
  private templateFactory: ComponentFactory<TemplateControlContentComponent>;
  private values: Array<TemplateControlValueWrapper>;

  protected init(): void {
    super.init();
    this.templateDataSources = new Array<TemplateControlTemplateDataSourceWrapper>();
    this.templateVariables = new Array<TemplateControlTemplateVariableWrapper>();
    this.values = new Array<TemplateControlValueWrapper>();
    this.compiler = this.getInjector().get(Compiler);
    this.imageService = this.getInjector().get(ImageService);
    this.patternFormatService = this.getInjector().get(PatternFormatService);
  }

  public getControlType(): ControlType {
    return ControlType.TemplateControl;
  }

  protected getComponentRef(): ComponentRef<ListViewComponent> {
    return super.getComponentRef() as ComponentRef<ListViewComponent>;
  }

  protected getComponent(): ListViewComponent {
    const compRef: ComponentRef<ListViewComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
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

  public getValues(): Array<TemplateControlValueWrapper> {
    return this.values;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TemplateControlComponent> {
    const factory: ComponentFactory<TemplateControlComponent> = this.getResolver().resolveComponentFactory(TemplateControlComponent);
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

    this.templateFactory = this.compileTemplateControlComponent();
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (dataJson && dataJson.templateControlData) {
      const valueMap: Map<string, string> = new Map<string, string>();

      if (dataJson.templateControlData.values && dataJson.templateControlData.values.length) {
        for (const value of dataJson.templateControlData.values) {
          valueMap.set(value.name, value.value);
        }
      }

      this.values = this.getValueList(valueMap);
    }
  }

  public getTemplateFactory(): ComponentFactory<TemplateControlContentComponent> {
    return this.templateFactory;
  }

  private getValueList(valueMap: Map<string, string>): Array<TemplateControlValueWrapper> {
    const values: Array<TemplateControlValueWrapper> = new Array<TemplateControlValueWrapper>();

    for (const templateVar of this.templateVariables) {
      const valueStr: string = valueMap.get(templateVar.getDataSource().getName());
      values.push(new TemplateControlValueWrapper(valueStr, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return values;
  }

  private parseViewTemplate(): string {
    let template: string = this.getTemplateHtml();

    if (String.isNullOrWhiteSpace(template)) {
      return null;
    }

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/g;
    const matches: RegExpMatchArray = template.match(regEx);

    if (!matches || !matches.length) {
      return template;
    }

    for (let i = 0; i < matches.length; i++) {
      const matchTrimmed: string = matches[i].trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let ds: TemplateControlTemplateDataSourceWrapper;
      let format: TextFormat;
      let formatPattern: string;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (String.isNullOrWhiteSpace(partTrimmed)) {
          continue;
        }

        let index: number = partTrimmed.indexOf(TemplateControlWrapper.PART_DS);

        if (index >= 0) {
          const dsStr: string = partTrimmed.substr(index + TemplateControlWrapper.PART_DS.length);
          ds = this.templateDataSources.find(tds => tds.getName() === dsStr);

          if (!ds) {
            throw new Error(`Could not find TemplateDataSource '${dsStr}' for TemplateVariable with index ${i}!`);
          }

          continue;
        }

        index = partTrimmed.indexOf(TemplateControlWrapper.PART_F);

        if (index >= 0) {
          const formatStr: string = partTrimmed.substr(index + TemplateControlWrapper.PART_F.length);
          format = parseInt(formatStr, 10);
          continue;
        }

        index = partTrimmed.indexOf(TemplateControlWrapper.PART_FP);

        if (index >= 0) {
          const formatPatternStr: string = partTrimmed.substr(index + TemplateControlWrapper.PART_FP.length);
          formatPattern = this.patternFormatService.javaToMoment(formatPatternStr);
          continue;
        }
      }

      let options: ITemplateControlTemplateVariableWrapperOptions = null;

      if (format || !String.isNullOrWhiteSpace(formatPattern)) {
        options = {
          format,
          formatPattern
        };
      }

      this.templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));

      template = template.replace(matches[i], `{{ values[${i}] }}`);
    }

    // Replace placeholders
    template = template.replace(/%FILESURL%/g, this.imageService.getFilesUrl());

    return template;
  }

  private parseTemplateDataSourceList(templateDataSourceListJson: Array<any>): Array<TemplateControlTemplateDataSourceWrapper> {
    if (!templateDataSourceListJson || !templateDataSourceListJson.length) {
      return null;
    }

    const templateDataSourceList: Array<TemplateControlTemplateDataSourceWrapper> = new Array<TemplateControlTemplateDataSourceWrapper>();

    for (const templateDataSourceJson of templateDataSourceListJson) {
      templateDataSourceList.push(new TemplateControlTemplateDataSourceWrapper(templateDataSourceJson.dataSourceName, templateDataSourceJson.dataSourceTypeID));
    }

    return templateDataSourceList;
  }

  private setErrorTemplate(): void {
    this.templateHtml = '<div class="wrapper">Template NULL</div>';
    this.templateCss = '.wrapper { display: flex; justify-content: center; align-items: center; }';
  }

  private compileTemplateControlComponent(): ComponentFactory<TemplateControlContentComponent> {
    const id: string = `${this.getForm().getName()}.${this.getName()}`;

    // Return buffered factory if there is one
    if (TemplateControlWrapper._factoryBuffer.has(id)) {
      return TemplateControlWrapper._factoryBuffer.get(id);
    }

    const tplHtml: string = '<div class="tpl" [attr.tplDisabled]="enabled ? null : true">' + this.templateHtml + '</div>';
    const tplCss: string = ':host { flex: 1; display: flex; flex-direction: column; } .tpl { flex: 1; box-sizing: border-box; }';

    const tplContentComp = Component({ selector: TemplateControlContentComponent.SELECTOR, template: tplHtml, styles: [tplCss, this.templateCss] })(class extends TemplateControlContentComponent { });
    const tplContentMod = NgModule({ declarations: [tplContentComp] })(class extends TemplateControlContentModule { });

    const factory: ComponentFactory<TemplateControlContentComponent> = this.compiler.compileModuleAndAllComponentsSync(tplContentMod).componentFactories[0];

    TemplateControlWrapper._factoryBuffer.set(id, factory);

    return factory;
  }

  public getState(): any {
    const json: any = super.getState();

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

    const valuesJson: Array<any> = new Array<any>();

    for (const value of this.values) {
      valuesJson.push({
        value: value.getValue(),
        format: value.getFormat(),
        formatPattern: value.getFormatPattern()
      });
    }

    if (valuesJson.length) {
      json.values = valuesJson;
    }

    return json;
  }

  protected setState(json: any): void {
    super.setState(json);

    this.templateCss = json.templateCss;
    this.templateHtml = json.templateHtml;

    if (json.templateDataSources && json.templateDataSources.length) {
      for (const dsJson of json.templateDataSources) {
        this.templateDataSources.push(new TemplateControlTemplateDataSourceWrapper(dsJson.name, dsJson.dsType));
      }
    }

    if (json.templateVariables && json.templateVariables.length) {
      for (const varJson of json.templateVariables) {
        const ds: TemplateControlTemplateDataSourceWrapper = this.templateDataSources.find(d => d.getName() === varJson.dsName);
        const format: TextFormat = varJson.format;
        const formatPattern: string = varJson.formatPattern;

        let options: ITemplateControlTemplateVariableWrapperOptions = null;

        if (format || !String.isNullOrWhiteSpace(formatPattern)) {
          options = {
            format,
            formatPattern
          };
        }

        this.templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));
      }
    }

    if (json.values && json.values.length) {
      this.values = new Array<TemplateControlValueWrapper>();
      for (const valueJson of json.values) {
        this.values.push(new TemplateControlValueWrapper(valueJson.value, valueJson.format, valueJson.formatPattern));
      }
    }

    this.templateFactory = this.compileTemplateControlComponent();
  }
}
