import { ComponentFactory, ComponentRef } from '@angular/core';
import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { TemplateControlComponent } from '@app/controls/template-control/template-control.component';
import { ControlType } from '@app/enums/control-type';
import { TextFormat } from '@app/enums/text-format';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TemplateControlTemplateDataSourceWrapper } from '@app/wrappers/template-control-template-datasource-wrapper';
import { ITemplateControlTemplateVariableWrapperOptions, TemplateControlTemplateVariableWrapper } from '@app/wrappers/template-control-template-variable-wrapper';
import { TemplateControlValueWrapper } from '@app/wrappers/template-control-value-wrapper';

export class TemplateControlWrapper extends ControlWrapper {

  public static readonly PART_DS: string = 'ds:';
  public static readonly PART_F: string = 'f:';
  public static readonly PART_FP: string = 'fp:';

  private _baseControlStyle: PropertyStore | null = null;
  private _templateCss: string | null = null;
  private _templateHtml: string | null = null;
  private _templateDataSources: Array<TemplateControlTemplateDataSourceWrapper> = new Array<TemplateControlTemplateDataSourceWrapper>();
  private _templateVariables: Array<TemplateControlTemplateVariableWrapper> = new Array<TemplateControlTemplateVariableWrapper>();
  private _templateValues: Array<TemplateControlValueWrapper> = new Array<TemplateControlValueWrapper>();

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
    this._templateDataSources = new Array<TemplateControlTemplateDataSourceWrapper>();
    this._templateVariables = new Array<TemplateControlTemplateVariableWrapper>();
    this._templateValues = new Array<TemplateControlValueWrapper>();
  }

  public getControlType(): ControlType {
    return ControlType.TemplateControl;
  }

  protected getComponentRef(): ComponentRef<TemplateControlComponent> | null {
    return super.getComponentRef() as ComponentRef<TemplateControlComponent> | null;
  }

  protected getComponent(): TemplateControlComponent | null {
    const compRef: ComponentRef<TemplateControlComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getTemplateControlCssGlobal(): string | null {
    const globalCss: string | undefined = this.baseControlStyle.getTemplateControlCssGlobal();
    return globalCss ?? null;
  }

  public getTemplateCss(): string | null {
    const templateCss: string | undefined = this.getPropertyStore().getTemplateCss();
    return templateCss ?? null;
  }

  public getTemplateHtml(): string | null {
    const templateHtml: string | undefined = this.getPropertyStore().getTemplateHtml();
    return templateHtml ?? null;
  }

  public getViewTemplateCss(): string | null {
    return this._templateCss;
  }

  public getViewTemplateHtml(): string | null {
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

    if (propertiesJson.templateDataSourceList != null && propertiesJson.templateDataSourceList.length > 0) {
      const parsedDataSources: Array<TemplateControlTemplateDataSourceWrapper> | null = this.parseTemplateDataSourceList(propertiesJson.templateDataSourceList);
      this._templateDataSources = parsedDataSources ?? new Array<TemplateControlTemplateDataSourceWrapper>();
    }

    this._templateCss = this.getTemplateCss();
    this._templateHtml = this.parseViewTemplate();

    if (this._templateHtml == null || this._templateHtml.trim().length === 0) {
      this.setErrorTemplate();
    }
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (dataJson && dataJson.templateControlData) {
      const dsValueMap: Map<string, string> = new Map<string, string>();

      if (dataJson.templateControlData.values != null && dataJson.templateControlData.values.length > 0) {
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
      const valueStr: string | undefined = valueMap.get(templateVar.getDataSource().getName());
      templateValues.push(new TemplateControlValueWrapper(valueStr ?? null, templateVar.getFormat(), templateVar.getFormatPattern()));
    }

    return templateValues;
  }

  private parseTemplateDataSourceList(templateDataSourceListJson: Array<any> | null): Array<TemplateControlTemplateDataSourceWrapper> | null {
    if (templateDataSourceListJson == null || templateDataSourceListJson.length === 0) {
      return null;
    }

    const templateDataSourceList: Array<TemplateControlTemplateDataSourceWrapper> = new Array<TemplateControlTemplateDataSourceWrapper>();

    for (const templateDataSourceJson of templateDataSourceListJson) {
      templateDataSourceList.push(new TemplateControlTemplateDataSourceWrapper(templateDataSourceJson.dataSourceName, templateDataSourceJson.dataSourceTypeID));
    }

    return templateDataSourceList;
  }

  private parseViewTemplate(): string | null {
    let templateHtml: string | null = this.getTemplateHtml();

    this._templateVariables = new Array<TemplateControlTemplateVariableWrapper>();

    if (templateHtml == null || templateHtml.trim().length === 0) {
      return null;
    }

    const filesUrl: string | null = this.getImageService().getFilesUrl();

    if (filesUrl != null) {
      templateHtml = templateHtml.replace(/%FILESURL%/g, filesUrl);
    }

    const regEx: RegExp = /{{2}([^}]|[^}])*}{2}/g;
    const matches: RegExpMatchArray | null = templateHtml.match(regEx);

    if (matches == null || matches.length === 0) {
      return templateHtml;
    }

    matches.forEach((match: string, index: number) => {
      const matchTrimmed: string = match.trimStringLeft('{{').trimCharsRight('}}').trim();
      const parts: Array<string> = matchTrimmed.split('|');

      let ds: TemplateControlTemplateDataSourceWrapper | undefined;
      let format: TextFormat | undefined;
      let formatPattern: string | undefined;

      for (const part of parts) {
        const partTrimmed = part.trim();

        if (partTrimmed.length === 0) {
          continue;
        }

        let partIndex: number = partTrimmed.indexOf(TemplateControlWrapper.PART_DS);

        if (partIndex >= 0) {
          const dsStr: string = partTrimmed.substr(partIndex + TemplateControlWrapper.PART_DS.length);
          ds = this._templateDataSources.find(tds => tds.getName() === dsStr);

          if (ds == null) {
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
          formatPattern = this.getPatternFormatService().javaToMoment(formatPatternStr);
          continue;
        }
      }

      if (ds != null) {
        let options: ITemplateControlTemplateVariableWrapperOptions | undefined;

        if (format != null || formatPattern != null && formatPattern.trim().length > 0) {
          options = {
            format,
            formatPattern
          };
        }

        this._templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));

        if (templateHtml != null) {
          templateHtml = templateHtml.replace(match, `{{${index}}}`);
        }
      }
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

    if (dataSourcesJson.length > 0) {
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

    if (variablesJson.length > 0) {
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

    if (valuesJson.length > 0) {
      json.values = valuesJson;
    }

    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    this._templateCss = json.templateCss;
    this._templateHtml = json.templateHtml;

    if (json.templateDataSources != null && json.templateDataSources.length > 0) {
      for (const dsJson of json.templateDataSources) {
        this._templateDataSources.push(new TemplateControlTemplateDataSourceWrapper(dsJson.name, dsJson.dsType));
      }
    }

    if (json.templateVariables != null && json.templateVariables.length > 0) {
      for (const varJson of json.templateVariables) {
        const ds: TemplateControlTemplateDataSourceWrapper | undefined = this._templateDataSources.find(d => d.getName() === varJson.dsName);
        const format: TextFormat | undefined = varJson.format;
        const formatPattern: string | undefined = varJson.formatPattern;

        if (ds != null) {
          let options: ITemplateControlTemplateVariableWrapperOptions | undefined;

          if (format != null || formatPattern != null && formatPattern.trim().length > 0) {
            options = {
              format,
              formatPattern
            };
          }

          this._templateVariables.push(new TemplateControlTemplateVariableWrapper(ds, options));
        }
      }
    }

    if (json.values != null && json.values.length > 0) {
      this._templateValues = new Array<TemplateControlValueWrapper>();
      for (const valueJson of json.values) {
        this._templateValues.push(new TemplateControlValueWrapper(valueJson.value, valueJson.format, valueJson.formatPattern));
      }
    }
  }
}
