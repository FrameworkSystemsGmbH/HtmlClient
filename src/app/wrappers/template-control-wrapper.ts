import { ComponentFactory, ComponentRef, Injector } from '@angular/core';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { TemplateControlComponent } from '@app/controls/template-control/template-control.component';
import { ControlType } from '@app/enums/control-type';
import { TextFormat } from '@app/enums/text-format';
import { PatternFormatService } from '@app/services/formatter/pattern-format.service';
import { ImageService } from '@app/services/image.service';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TemplateControlTemplateDataSourceWrapper } from '@app/wrappers/template-control-template-datasource-wrapper';
import { ITemplateControlTemplateVariableWrapperOptions, TemplateControlTemplateVariableWrapper } from '@app/wrappers/template-control-template-variable-wrapper';
import { TemplateControlValueWrapper } from '@app/wrappers/template-control-value-wrapper';

export class TemplateControlWrapper extends ControlWrapper {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private _baseControlStyle: PropertyStore;
  private _imageService: ImageService;
  private _patternFormatService: PatternFormatService;
  private _templateCss: string;
  private _templateHtml: string;
  private _templateDataSources: Array<TemplateControlTemplateDataSourceWrapper>;
  private _templateVariables: Array<TemplateControlTemplateVariableWrapper>;
  private _templateValues: Array<TemplateControlValueWrapper>;

  protected init(): void {
    super.init();
    const injector: Injector = this.getInjector();
    this._templateDataSources = new Array<TemplateControlTemplateDataSourceWrapper>();
    this._templateVariables = new Array<TemplateControlTemplateVariableWrapper>();
    this._templateValues = new Array<TemplateControlValueWrapper>();
    this._imageService = injector.get(ImageService);
    this._patternFormatService = injector.get(PatternFormatService);
  }

  private initBaseControlStyle(): void {
    if (!this._baseControlStyle) {
      this._baseControlStyle = new PropertyStore();
      this._baseControlStyle.setLayer(PropertyLayer.ControlStyle, this.getControlStyleService().getBaseControlStyle());
    }
  }

  public getControlType(): ControlType {
    return ControlType.TemplateControl;
  }

  protected getComponentRef(): ComponentRef<TemplateControlComponent> {
    return super.getComponentRef() as ComponentRef<TemplateControlComponent>;
  }

  protected getComponent(): TemplateControlComponent {
    const compRef: ComponentRef<TemplateControlComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getTemplateControlCssGlobal(): string {
    this.initBaseControlStyle();
    return this._baseControlStyle.getTemplateControlCssGlobal();
  }

  public getTemplateCss(): string {
    return this.getPropertyStore().getTemplateCss();
  }

  public getTemplateHtml(): string {
    return this.getPropertyStore().getTemplateHtml();
  }

  public getViewTemplateCss(): string {
    return this._templateCss;
  }

  public getViewTemplateHtml(): string {
    return this._templateHtml;
  }

  public getViewTemplateValues(): Array<TemplateControlValueWrapper> {
    return this._templateValues;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TemplateControlComponent> {
    const factory: ComponentFactory<TemplateControlComponent> = this.getResolver().resolveComponentFactory(TemplateControlComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public canReceiveKeyboardFocus(): boolean {
    return false;
  }

  protected setPropertiesJson(propertiesJson: any): void {
    super.setPropertiesJson(propertiesJson);

    if (propertiesJson.templateDataSourceList && propertiesJson.templateDataSourceList.length) {
      this._templateDataSources = this.parseTemplateDataSourceList(propertiesJson.templateDataSourceList);
    }

    this._templateCss = this.getTemplateCss();
    this._templateHtml = this.parseViewTemplate();

    if (String.isNullOrWhiteSpace(this._templateHtml)) {
      this.setErrorTemplate();
    }
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (dataJson && dataJson.templateControlData) {
      const dsValueMap: Map<string, string> = new Map<string, string>();

      if (dataJson.templateControlData.values && dataJson.templateControlData.values.length) {
        for (const value of dataJson.templateControlData.values) {
          dsValueMap.set(value.name, value.value);
        }
      }

      this._templateValues = this.getTemplateValues(dsValueMap);
    }
  }

  private getTemplateValues(valueMap: Map<string, string>): Array<TemplateControlValueWrapper> {
    const templateValues: Array<TemplateControlValueWrapper> = new Array<TemplateControlValueWrapper>();

    for (const templateVar of this._templateVariables) {
      const valueStr: string = valueMap.get(templateVar.getDataSource().getName());
      templateValues.push(new TemplateControlValueWrapper(valueStr, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return templateValues;
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

  private parseViewTemplate(): string {
    let templateHtml: string = this.getTemplateHtml();

    this._templateVariables = new Array<TemplateControlTemplateVariableWrapper>();

    if (String.isNullOrWhiteSpace(templateHtml)) {
      return null;
    }

    templateHtml = templateHtml.replace(/%FILESURL%/g, this._imageService.getFilesUrl());

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/g;
    const matches: RegExpMatchArray = templateHtml.match(regEx);

    if (!matches || !matches.length) {
      return templateHtml;
    }

    matches.forEach((match: string, index: number) => {
      const matchTrimmed: string = match.trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let ds: TemplateControlTemplateDataSourceWrapper;
      let format: TextFormat;
      let formatPattern: string;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (String.isNullOrWhiteSpace(partTrimmed)) {
          continue;
        }

        let partIndex: number = partTrimmed.indexOf(TemplateControlWrapper.PART_DS);

        if (partIndex >= 0) {
          const dsStr: string = partTrimmed.substr(partIndex + TemplateControlWrapper.PART_DS.length);
          ds = this._templateDataSources.find(tds => tds.getName() === dsStr);

          if (!ds) {
            throw new Error(`Could not find TemplateDataSource '${dsStr}' for TemplateVariable '${match}'!`);
          }

          continue;
        }

        partIndex = partTrimmed.indexOf(TemplateControlWrapper.PART_F);

        if (partIndex >= 0) {
          const formatStr: string = partTrimmed.substr(partIndex + TemplateControlWrapper.PART_F.length);
          format = parseInt(formatStr, 10);
          continue;
        }

        partIndex = partTrimmed.indexOf(TemplateControlWrapper.PART_FP);

        if (partIndex >= 0) {
          const formatPatternStr: string = partTrimmed.substr(partIndex + TemplateControlWrapper.PART_FP.length);
          formatPattern = this._patternFormatService.javaToMoment(formatPatternStr);
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

      this._templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));

      templateHtml = templateHtml.replace(match, `{{${index}}}`);
    });

    return templateHtml;
  }

  private setErrorTemplate(): void {
    this._templateCss = '.tpl { display: flex; align-items: center; justify-content: center; }';
    this._templateHtml = 'Template NULL';
  }

  public saveState(): any {
    const json: any = super.saveState();

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

    const valuesJson: Array<any> = new Array<any>();

    for (const value of this._templateValues) {
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

  protected loadState(json: any): void {
    super.loadState(json);

    this._templateCss = json.templateCss;
    this._templateHtml = json.templateHtml;

    if (json.templateDataSources && json.templateDataSources.length) {
      for (const dsJson of json.templateDataSources) {
        this._templateDataSources.push(new TemplateControlTemplateDataSourceWrapper(dsJson.name, dsJson.dsType));
      }
    }

    if (json.templateVariables && json.templateVariables.length) {
      for (const varJson of json.templateVariables) {
        const ds: TemplateControlTemplateDataSourceWrapper = this._templateDataSources.find(d => d.getName() === varJson.dsName);
        const format: TextFormat = varJson.format;
        const formatPattern: string = varJson.formatPattern;

        let options: ITemplateControlTemplateVariableWrapperOptions = null;

        if (format || !String.isNullOrWhiteSpace(formatPattern)) {
          options = {
            format,
            formatPattern
          };
        }

        this._templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));
      }
    }

    if (json.values && json.values.length) {
      this._templateValues = new Array<TemplateControlValueWrapper>();
      for (const valueJson of json.values) {
        this._templateValues.push(new TemplateControlValueWrapper(valueJson.value, valueJson.format, valueJson.formatPattern));
      }
    }
  }
}
