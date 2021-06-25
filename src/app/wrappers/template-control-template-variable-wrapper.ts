import { TextFormat } from '@app/enums/text-format';
import { TemplateControlTemplateDataSourceWrapper } from '@app/wrappers/template-control-template-datasource-wrapper';

export interface ITemplateControlTemplateVariableWrapperOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class TemplateControlTemplateVariableWrapper {

  private readonly _dataSource: TemplateControlTemplateDataSourceWrapper;
  private readonly _format: TextFormat;
  private readonly _formatPattern: string;

  public constructor(dataSource: TemplateControlTemplateDataSourceWrapper, options?: ITemplateControlTemplateVariableWrapperOptions) {
    this._dataSource = dataSource;

    if (options && options.format) {
      this._format = options.format;
    }

    if (options && !String.isNullOrWhiteSpace(options.formatPattern)) {
      this._formatPattern = options.formatPattern;
    }
  }

  public getDataSource(): TemplateControlTemplateDataSourceWrapper {
    return this._dataSource;
  }

  public getFormat(): TextFormat {
    return this._format;
  }

  public getFormatPattern(): string {
    return this._formatPattern;
  }
}
