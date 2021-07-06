import { TextFormat } from '@app/enums/text-format';
import { TemplateControlTemplateDataSourceWrapper } from '@app/wrappers/template-control-template-datasource-wrapper';

export interface ITemplateControlTemplateVariableWrapperOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class TemplateControlTemplateVariableWrapper {

  private readonly _dataSource: TemplateControlTemplateDataSourceWrapper;
  private readonly _format: TextFormat = TextFormat.None;
  private readonly _formatPattern: string | null = null;

  public constructor(dataSource: TemplateControlTemplateDataSourceWrapper, options?: ITemplateControlTemplateVariableWrapperOptions) {
    this._dataSource = dataSource;

    if (options != null && options.format != null) {
      this._format = options.format;
    }

    if (options != null && options.formatPattern != null && options.formatPattern.trim().length > 0) {
      this._formatPattern = options.formatPattern;
    }
  }

  public getDataSource(): TemplateControlTemplateDataSourceWrapper {
    return this._dataSource;
  }

  public getFormat(): TextFormat {
    return this._format;
  }

  public getFormatPattern(): string | null {
    return this._formatPattern;
  }
}
